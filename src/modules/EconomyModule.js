const { Module } = require('../')

const moment = require('moment')

// Bonus
class BonusCooldownError extends Error {
  constructor (lastClaim, formattedCooldown) {
    super('ALREADY_CLAIMED')
    this.lastClaim = lastClaim
    this.formattedCooldown = formattedCooldown
  }
}

const BONUS_INTERVAL = 24 * 60 * 60 * 1000 // 1 day
class BonusModule extends Module {
  constructor (...args) {
    super(...args)
    this.name = 'bonus'
  }

  get _users () {
    return this.client.database.users
  }

  checkClaim (lastClaim) {
    return Date.now() - lastClaim < BONUS_INTERVAL
  }

  formatClaimTime (lastClaim) {
    return moment.duration(BONUS_INTERVAL - (Date.now() - lastClaim)).format('h[h] m[m] s[s]')
  }

  async claimDaily (_user) {
    const user = await this._users.get(_user, 'money lastDaily')
    const { lastDaily } = user

    if (this.checkClaim(lastDaily)) {
      throw new BonusCooldownError(lastDaily, this.formatClaimTime(lastDaily))
    }

    const collectedMoney = Math.ceil(Math.random() * 2000) + 750
    user.money += collectedMoney
    user.lastDaily = Date.now()
    await user.save()

    return { collectedMoney }
  }

  async claimDBLBonus (_user) {
    const user = await this._users.get(_user, 'money')

    const collectedMoney = 250
    user.money += collectedMoney
    await user.save()

    return { collectedMoney }
  }
}

// Economy
module.exports = class EconomyModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'economy'
    this.submodules = [ new BonusModule(client, this) ]
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  get _giftcode () {
    return this.client.database.giftcodes
  }

  async transfer (_from, _to, amount) {
    const from = await this._users.get(_from, 'money')
    if (from.money < amount) throw new Error('NOT_ENOUGH_MONEY')
    from.money -= amount
    await Promise.all([ from.save(), this._users.update(_to, { $inc: { money: amount } }) ])
  }

  async balance (_user) {
    const { money } = await this._users.get(_user, 'money')
    return money
  }

  async betflip (_user, amount, side) {
    const user = await this._users.get(_user, 'money')

    if (user.money < amount) throw new Error('NOT_ENOUGH_MONEY')

    const chosenSide = Math.random() > 0.5 ? 'heads' : 'tails'
    const won = side === chosenSide
    const bet = won ? amount : -amount

    user.money += bet
    await user.save()

    return { won, chosenSide }
  }

  async removeMoney (_user, amount) {
    const user = await this._users.get(_user, 'money')

    if (user.money < amount) throw new Error('NOT_ENOUGH_MONEY')

    user.money -= amount
    await user.save()
  }

  async addMoney (_user, amount) {
    const user = await this._users.get(_user, 'money')

    user.money += amount
    await user.save()
  }

  async createGiftCode (_user, amount) {
    const user = await this._users.get(_user, 'money')
    if (user.money < amount) throw new Error('NOT_ENOUGH_MONEY')
    const identifier = await this.generateRandomString(12)
    const giftcodeDoc = await this._giftcode.get(identifier)

    giftcodeDoc.value = amount
    giftcodeDoc.generatedBy = _user
    this.removeMoney(_user, amount)
    await giftcodeDoc.save()

    return { identifier, giftcodeDoc }
  }

  async redeemGiftCode (_user, giftcode) {
    const gCode = await this._giftcode.findOne(giftcode)

    if (!gCode) throw new Error('INVALID_CODE')
    if (gCode.claimed === true) throw new Error('ALREADY_CLAIMED')
    gCode.claimed = true
    gCode.claimedBy = _user
    await gCode.save()
    this.addMoney(_user, gCode.value)
    return { gCode }
  }

  generateRandomString (length) {
    const str = []
    for (let i = 0; i < length; i++) {
      str.push(Math.round(Math.random() * 36).toString(36))
    }
    return str.join('').toUpperCase()
  }
}
