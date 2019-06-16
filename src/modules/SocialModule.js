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
    this.client.logger.debug(`Updating ${_user}'s profile`, { label: this.constructor.name, user: { id: _user }, entity })
    return this.validateProfile(entity).then(() => this._users.update(_user, entity))
  }

  async setFavoriteColor (_user, favColor) {
    this.client.logger.debug(`Updating ${_user}'s favorite color`, { label: this.constructor.name, user: { id: _user }, favColor })
    await this._users.update(_user, { favColor })
  }

  async setPersonalText (_user, personalText) {
    this.client.logger.debug(`Updating ${_user}'s personal text`, { label: this.constructor.name, user: { id: _user }, personalText })
    if (personalText.length > this.PERSONAL_TEXT_LIMIT) throw new Error('TEXT_LENGTH')
    await this._users.update(_user, { personalText })
  }

  async addReputation (_from, _to) {
    this.client.logger.debug(`${_from} is trying to give ${_to} a reputation point`, { label: this.constructor.name, from: { id: _from }, to: { id: _to } })
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
    this.client.logger.debug(`Retrieving ${_user}'s profile from the database`, { label: this.constructor.name, user: { id: _user }, projection })
    return this._users.findOne(_user, projection)
  }

  async leaderboard (sortField, projection = sortField, size = 10) {
    this.client.logger.debug(`Retrieving ${sortField} leaderboard from the database`, { label: this.constructor.name, sortField, projection, size })
    const dbRes = await this._users.model.find({}, projection).sort({ [sortField]: -1 }).limit(size + 6)
    const top = dbRes.map(this._users.parse).filter(u => {
      u.user = this.client.users.get(u._id)
      return !!u.user
    })

    return top.splice(0, size)
  }
}
