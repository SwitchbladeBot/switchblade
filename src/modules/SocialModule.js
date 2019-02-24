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
      personalText: Joi.string().max(this.PERSONAL_TEXT_LIMIT).truncate().empty(''),
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
    const from = await this._users.get(_from, 'lastRep')

    const now = Date.now()
    const lastRep = from.lastRep
    if (now - lastRep < REP_INTERVAL) {
      throw new RepCooldownError(lastRep, moment.duration(REP_INTERVAL - (now - lastRep)).format('h[h] m[m] s[s]'))
    }

    from.lastRep = now

    await Promise.all([
      this._users.update(_from, { lastRep: now }),
      this._users.update(_to, { $inc: { rep: 1 } }) ])
  }

  async retrieveProfile (_user) {
    const {
      money = 0,
      rep = 0,
      personalText = 'Did you know you can edit this in the future dashboard or using the personaltext command? :o',
      favColor = process.env.EMBED_COLOR
    } = (this._users.findOne(_user, 'money rep personalText favColor') || {})

    return { money, rep, personalText, favColor }
  }

  async leaderboard (sortField, projection = sortField, size = 16) {
    const top = (await this._users.model.find({}, projection).sort({ [sortField]: -1 }).limit(16)).map(this._users.parse).filter(u => {
      u.user = this.client.users.get(u.id)
      return !!u.user
    })

    return top.splice(0, size)
  }
}
