const { Module } = require('../')

// Leveling
module.exports = class LevelingModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'leveling'
    this.minRandomExperience = 5
    this.maxRandomExperience = 20

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

  levelFromExperience (xp, modifier = 0.37) {
    const r = (-this.B + Math.sqrt(Math.pow(this.B, 2) - ((4 * this.A) * ((this.C * (1 + modifier)) - Math.ceil(xp / (1 + modifier)))))) / (2 * this.A)
    return (r < 0 || isNaN(r)) ? 0 : Math.floor(r)
  }

  experienceFromLevel (level, modifier = 0.37) {
    return Math.floor((this.A * Math.pow(level, 2) + (this.B * level) + (this.C * (1 + modifier))) * (1 + modifier))
  }

  experienceInCurrentLevel (level, xp, modifier = 0.37) {
    return xp - this.experienceFromLevel(level)
  }

  experienceBetweenCurrentAndNextLevel (level, modifier = 0.37) {
    return this.experienceFromLevel(level + 1, modifier) - this.experienceFromLevel(level, modifier)
  }

  async giveExperience (_user) {
    // TODO: change this system
    const { globalXp } = await this._users.findOne(_user, 'globalXp')
    const newExperience = Math.floor(Math.random() * (this.maxRandomExperience - this.minRandomExperience + 1) + this.minRandomExperience)
    console.log(`old xp: ${globalXp} new xp: ${globalXp + newExperience}`)
    console.log(`to next: ${this.experienceInCurrentLevel(this.levelFromExperience(globalXp), globalXp)}/${this.experienceBetweenCurrentAndNextLevel(this.levelFromExperience(globalXp))} (total xp: ${globalXp})`)
    console.log(`percent: ${((globalXp - this.experienceFromLevel(this.levelFromExperience(globalXp))) / (this.experienceFromLevel(this.levelFromExperience(globalXp) + 1) - this.experienceFromLevel(this.levelFromExperience(globalXp)))) * 100}%`)
    console.log('-----')
    await this._users.update(_user, { $inc: { globalXp: newExperience } })

    if (this.levelFromExperience(globalXp) !== this.levelFromExperience(globalXp + newExperience)) console.log(`level up to ${this.levelFromExperience(globalXp + newExperience)}`)
  }
}
