const { Module } = require('../')

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
module.exports = class SocialModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'social'

    this.PERSONAL_TEXT_LIMIT = 260
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  validateProfile (entity) {
    return Joi.validate(entity, Joi.object().keys({
      personalText: Joi.string().max(260).truncate(),
      favColor: Joi.string().regex(/^#([a-f\d]{3}|[a-f\d]{6})$/i)
    }))
  }

  async updateProfile (_user, entity) {
    return this.validateProfile(entity).then(() => this._users.update(_user, entity))
  }

  async setFavoriteColor (_user, favColor) {
    await this._users.update(_user, { favColor })
  }

  async setPersonalText (_user, personalText) {
    if (personalText.length > this.PERSONAL_TEXT_LIMIT) throw new Error('TEXT_LENGTH')
    await this._users.update(_user, { personalText })
  }

  async addReputation (_from, _to) {
    const [ from, to ] = await Promise.all([
      this._users.get(_from, 'lastRep'),
      this._users.get(_to, 'rep')
    ])

    const now = Date.now()
    const lastRep = from.lastRep
    if (now - lastRep < REP_INTERVAL) {
      throw new RepCooldownError(lastRep, moment.duration(REP_INTERVAL - (now - lastRep)).format('h[h] m[m] s[s]'))
    }

    from.lastRep = now
    to.rep++

    await Promise.all([ from.save(), to.save() ])
  }

  async retrieveProfile (_user) {
    return this._users.get(_user, 'money rep personalText favColor')
  }

  async leaderboard (sortField, projection = sortField, size = 16) {
    const top = (await this._users.model.find({}, projection).sort({ [sortField]: -1 }).limit(16)).map(this._users.parse).filter(u => {
      u.user = this.client.users.get(u.id)
      return !!u.user
    })

    return top.splice(0, size)
  }
}
