const { Module } = require('../structures')
const snekfetch = require('snekfetch')

module.exports = class Rewards extends Module {
  constructor (client) {
    super(client)
    this.name = 'rewards'
    this.requiresDatabase = true
  }

  async checkListcordVote (user) {
    const { lastListcordBonusClaim } = await this.client.database.users.get(user.id)
    return lastListcordBonusClaim
  }

  async validadeListcordVote (user) {
    const { body } = await snekfetch.get(`https://listcord.com/api/bot/${this.client.user.id}/votes`)
    const userVote = body.find(u => u.id === user.id)
    return userVote
  }

  async collectListcord (user, date, collectedMoney) {
    const userDoc = await this.client.database.users.get(user.id)
    userDoc.money += collectedMoney
    userDoc.lastListcordBonusClaim = date
    userDoc.save()
    this.logListcord(collectedMoney, user)
  }

  logListcord (value, user) {
    this.client.log(`${value} Switchcoins were collected by ${user.id} from Listcord bonus`, 'Modules', 'Rewards')
  }
}
