const { Module } = require('../structures')

module.exports = class Economy extends Module {
  constructor (client) {
    super(client)
    this.name = 'economy'
    this.requiresDatabase = true
  }

  async checkBalance (user) {
    const { money } = await this.client.database.users.get(user.id)
    return money
  }

  async addMoney (user, value) {
    const userDoc = await this.client.database.users.get(user.id)
    userDoc.money += value
    userDoc.save()
    this.logAdded(value, user)
  }

  async removeMoney (user, value) {
    const userDoc = await this.client.database.users.get(user.id)
    userDoc.money -= value
    userDoc.save()
    this.logRemoved(value, user)
  }

  async sendTo (sender, receiver, value) {
    const senderDoc = await this.client.database.users.get(sender.id)
    const receiverDoc = await this.client.database.users.get(receiver.id)
    senderDoc.money -= value
    receiverDoc.money += value
    senderDoc.save()
    receiverDoc.save()
    this.logTransaction(value, sender, receiver)
  }

  async checkDaily (user) {
    const { lastDaily } = await this.client.database.users.get(user.id)
    return lastDaily
  }

  async collectDaily (user, date, collectedMoney) {
    const userDoc = await this.client.database.users.get(user.id)
    userDoc.money += collectedMoney
    userDoc.lastDaily = date
    userDoc.save()
    this.logDaily(collectedMoney, user)
  }

  logTransaction (value, sender, receiver) {
    this.client.log(`${value} Switchcoins were sent from ${sender.id} to ${receiver.id}`, 'Modules', 'Economy')
  }

  logDaily (value, user) {
    this.client.log(`${value} Switchcoins were collected by ${user.id} from daily`, 'Modules', 'Economy')
  }

  logAdded (value, user) {
    this.client.log(`${value} Switchcoins were added to ${user.id}'s account`, 'Modules', 'Economy')
  }

  logRemoved (value, user) {
    this.client.log(`${value} Switchcoins were added to ${user.id}'s account`, 'Modules', 'Economy')
  }
}
