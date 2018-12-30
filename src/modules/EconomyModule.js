const { Module } = require('../')

const moment = require('moment')

// Daily
class DailyCooldownError extends Error {
  constructor (lastDaily, formattedCooldown) {
    super('IN_COOLDOWN')
    this.lastDaily = lastDaily
    this.formattedCooldown = formattedCooldown
  }
}

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day
class DailyModule extends Module {
  constructor (...args) {
    super(...args)
    this.name = 'daily'
  }

  get _users () {
    return this.client.database.users
  }

  async claim (_user) {
    const user = await this._users.get(_user, 'money lastDaily')
    const { money, lastDaily } = user

    const now = Date.now()
    if (now - lastDaily < DAILY_INTERVAL) {
      throw new DailyCooldownError(lastDaily, moment.duration(DAILY_INTERVAL - (now - lastDaily)).format('h[h] m[m] s[s]'))
    }

    const collectedMoney = Math.ceil(Math.random() * 2000) + 750
    user.money += collectedMoney
    user.lastDaily = now
    await user.save()

    return { collectedMoney }
  }  
}

// Economy
module.exports = class EconomyModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'economy'
    this.submodules = [ new DailyModule(client, this) ]
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  async transfer (_from, _to, amount) {
    const [ from, to ] = await Promise.all([
      this._users.get(_from, 'money'),
      this._users.get(_to, 'money')
    ])

    if (from.money < amount) throw new Error('NOT_ENOUGH_MONEY')

    from.money -= amount
    to.money += amount

    await Promise.all([ from.save(), to.save() ])
  }

  async balance (_user) {
    const { money } = await this._users.get(_user, 'money')
    return money
  }
}
