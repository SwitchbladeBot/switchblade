const { Module } = require('../')

// Leveling
module.exports = class LevelingModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'leveling'

    this.minMessageLenght = 10
    this.maxMessageLenght = 800
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  experienceFromLevel (level) {
    level = level + 1
    let a = Math.floor(((6 / 5) * Math.pow(level, 3)) - ((15) * Math.pow(level, 2)) + (100 * (level)) - 140)
    if (a < 0) a = 0
    return a
  }

  levelFromExperience (exp) {
    let level = 1
    while (exp >= this.experienceFromLevel(level)) {
      exp -= this.experienceFromLevel(level)
      level++
      console.log(exp)
    }
    return level
  }

  calculateExpGain (level, message, modifier = 5) {
    let expBonus = message.content.replace(/\s+/g, '').length

    if (expBonus > this.maxMessageLenght) expBonus = 5
    if (expBonus > 270) expBonus = Math.floor(expBonus / 2)

    if (expBonus !== 0) {
      let expGain = Math.floor((((1 * expBonus * modifier) / (5 * 1)) * ((Math.pow(2 * modifier + 10, 2.5)) / (Math.pow(modifier + level + 10), 2.5)) + 1) * 1 * 1 * 1 / 100)
      if (expGain >= 500) Math.floor(expGain / Math.pow(Math.PI, Math.log(expGain)))
      if (expBonus < this.minMessageLenght) expGain = Math.floor(expGain / 2)

      console.log(`Total XP Gain for this message: ${expGain} XP`)
      console.log(`Base XP for this message: ${expBonus} XP`)
      return expGain
    } else {
      return 0
    }
  }

  async giveExperience (_user, message) {
    // const { globalXp } = await this._users.findOne(_user, 'globalXp')
    const currentLevel = 0
    const newExperience = this.experienceFromLevel(currentLevel, message)
    await this._users.update(_user, { $inc: { globalXp: newExperience } })
  }
}
