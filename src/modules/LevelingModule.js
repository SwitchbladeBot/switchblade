const { Module } = require('../')

// Leveling
module.exports = class LevelingModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'leveling'
    this.minRandomExperience = 2
    this.maxRandomExperience = 12

    this.A = 5
    this.B = 50
    this.C = 100
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  levelFromExperience (xp, modifier = 0.1) {
    const r = (-this.B + Math.sqrt(Math.pow(this.B, 2) - ((4 * this.A) * ((this.C * (1 + modifier)) - Math.ceil(xp / (1 + modifier)))))) / (2 * this.A)
    return (r < 0 || isNaN(r)) ? 0 : Math.floor(r)
  }

  experienceFromLevel (level, modifier = 0.1) {
    return Math.floor((this.A * Math.pow(level, 2) + (this.B * level) + (this.C * (1 + modifier))) * (1 + modifier))
  }

  async giveExperience (_user) {
    // TODO: change this system
    const { globalXp } = await this._users.findOne(_user, 'globalXp')
    const newExperience = Math.floor(Math.random() * (this.maxRandomExperience - this.minRandomExperience + 1) + this.minRandomExperience)
    await this._users.update(_user, { $inc: { globalXp: newExperience } })

    if (this.levelFromExperience(globalXp) !== this.levelFromExperience(globalXp + newExperience)) console.log(`level up to ${this.levelFromExperience(globalXp + newExperience)}`)
  }
}
