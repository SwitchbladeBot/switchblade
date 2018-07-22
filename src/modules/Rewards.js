const { Module } = require('../structures')
const snekfetch = require('snekfetch')

class Rewards extends Module {
  constructor (client) {
    super(client)
    this.name = 'rewards'
    this.requiresDatabase = true
  }

  async validadeListcordVote ({ user }) {
    const { body } = await snekfetch.get(`https://listcord.com/api/bot/${this.client.user.id}/votes`)
    return { ok: true, vote: body.find(u => u.id === user.id) }
  }

  async collectListcord ({ user, doc }) {
    doc = doc || await this.client.database.users.get(user.id)

    const { lastBonus: lastListcordBonusClaim } = doc
    const now = Date.now()
    const LISTCORD_INTERVAL = this.constructor.LISTCORD_INTERVAL
    if (now - lastBonus < LISTCORD_INTERVAL) {
      return { ok: false, error: 'IN_INTERVAL', lastBonus, interval: LISTCORD_INTERVAL - (now - lastBonus) }
    }

    const { vote } = await this.validadeListcordVote({ user })
    if (!vote || now - vote.lastVote >= LISTCORD_INTERVAL) {
      return { ok: false, error: 'INVALID_VOTE' }
    }

    const value = this.contructor.LISTCORD_BONUS()
    doc.money += value
    doc.lastListcordBonusClaim = now
    doc.save()
    this.logListcord(user, value)
    return { ok: true, value }
  }

  logListcord (user, value) {
    this.log(`${value} Switchcoins were collected by ${user.id} from Listcord bonus`)
  }
}

Rewards.LISTCORD_INTERVAL = 24 * 60 * 60 * 1000
Rewards.LISTCORD_BONUS = () => 500

module.exports = Rewards
