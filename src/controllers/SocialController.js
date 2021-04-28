const { Controller } = require('../')

const moment = require('moment')
const Joi = require('joi')

const REP_INTERVAL = 24 * 60 * 60 * 1000 // 1 day
class RepCooldownError extends Error {
  constructor (lastRep, formattedCooldown) {
    super('IN_COOLDOWN')
    this.lastRep = lastRep
    this.formattedCooldown = formattedCooldown
  }
}

// Social
module.exports = class SocialController extends Controller {
  constructor (client) {
    super({
      name: 'social'
    }, client)
    this.PERSONAL_TEXT_LIMIT = 260
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  validateProfile (entity) {
    const { error, value } = Joi.object().keys({
      personalText: Joi.string().max(this.PERSONAL_TEXT_LIMIT).truncate().empty(''),
      favColor: Joi.string().regex(/^#([a-f\d]{3}|[a-f\d]{6})$/i)
    }).validate(entity)
    if (error) throw error
    return value
  }

  async updateProfile (_user, entity) {
    this.validateProfile(entity)
    return this._users.update(_user, entity)
  }

  async setFavoriteColor (_user, favColor) {
    await this._users.update(_user, { favColor })
  }

  async setPersonalText (_user, personalText) {
    if (personalText.length > this.PERSONAL_TEXT_LIMIT) throw new Error('TEXT_LENGTH')
    await this._users.update(_user, { personalText })
  }

  async addReputation (_from, _to) {
    const { lastRep } = await this._users.findOne(_from, 'lastRep')
    const now = Date.now()
    if (now - lastRep < REP_INTERVAL) {
      throw new RepCooldownError(lastRep, moment.duration(REP_INTERVAL - (now - lastRep)).format('h[h] m[m] s[s]'))
    }

    await Promise.all([
      this._users.update(_from, { lastRep: now }),
      this._users.update(_to, { $inc: { rep: 1 } })
    ])
  }

  retrieveProfile (_user, projection = 'money rep personalText favColor') {
    return this._users.findOne(_user, projection)
  }

  async leaderboard (sortField, projection = sortField, size = 10) {
    const dbRes = await this._users.model.find({}, projection).sort({ [sortField]: -1 }).limit(size + 6)
    const top = dbRes.map(this._users.parse).filter(u => {
      u.user = this.client.users.cache.get(u._id)
      return !!u.user
    })

    return top.splice(0, size)
  }
}
