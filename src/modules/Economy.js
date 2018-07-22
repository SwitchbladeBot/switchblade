const { Module } = require('../structures')

class Economy extends Module {
  constructor (client) {
    super(client)
    this.name = 'economy'
    this.requiresDatabase = true
  }

  async checkBalance ({ user, doc }) {
    const { money } = doc || await this.client.database.users.get(user.id)
    return { ok: true, balance: money }
  }

  async addMoney ({ user, doc, value }) {
    doc = doc || await this.client.database.users.get(user.id)

    doc.money += Math.abs(Math.round(value))
    doc.save()
    this.logAdded(user, value)
    return { ok: true, balance: doc.money }
  }

  async removeMoney ({ user, doc, value }) {
    doc = doc || await this.client.database.users.get(user.id)

    value = Math.abs(Math.round(value))
    if (doc.money < value) {
      return { ok: false, error: 'INSUFFICIENT_FUNDS', senderBalance: doc.money }
    }

    doc.money -= value
    doc.save()
    this.logRemoved(user, value)
    return { ok: true, balance: doc.money }
  }

  async transfer ({ sender, senderDoc, receiver, receiverDoc, value }) {
    senderDoc = senderDoc || await this.client.database.users.get(sender.id)
    receiverDoc = receiverDoc || await this.client.database.users.get(receiver.id)

    value = Math.abs(Math.round(value))
    if (sender === receiver) {
      return { ok: false, error: 'SAME_ACCOUNT' }
    }

    if (senderDoc.money < value) {
      return { ok: false, error: 'INSUFFICIENT_FUNDS', senderBalance: senderDoc.money }
    }

    this.removeMoney({ user: sender, doc: senderDoc, value })
    this.addMoney({ user: receiver, doc: receiverDoc, value })
    this.logTransaction(sender, receiver, value)
    return { ok: true, value, senderBalance: senderDoc.money, receiverBalance: receiverDoc.money }
  }

  async collectDaily ({ user, doc }) {
    doc = doc || await this.client.database.users.get(user.id)

    const { lastDaily } = doc
    const now = Date.now()
    const DAILY_INTERVAL = this.constructor.DAILY_INTERVAL
    if (now - lastDaily < DAILY_INTERVAL) {
      return { ok: false, error: 'IN_INTERVAL', lastDaily, interval: DAILY_INTERVAL - (now - lastDaily) }
    }

    doc.lastDaily = now
    const value = this.constructor.DAILY_BONUS()
    this.logDaily(user, value)
    this.addMoney({ user, doc, value })
    return { ok: true, value }
  }

  logTransaction (sender, receiver, value) {
    this.log(`${value} Switchcoins were sent from ${sender.id} to ${receiver.id}`)
  }

  logDaily (user, value) {
    this.log(`${value} Switchcoins were collected by ${user.id} from daily`)
  }

  logAdded (user, value) {
    this.log(`${value} Switchcoins were added to ${user.id}'s account`)
  }

  logRemoved (user, value) {
    this.log(`${value} Switchcoins were removed from ${user.id}'s account`)
  }
}

Economy.DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day
Economy.DAILY_BONUS = () => Math.ceil(Math.random() * 2000) + 750

module.exports = Economy
