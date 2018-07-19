const { Module } = require('../structures')

module.exports = class Economy extends Module {
  constructor (client) {
    super(client)
    this.name = 'economy'
    this.requireDatabase = true
  }

  load () {
    return this
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

  async checkBalance (user) {
    const { money } = await this.database.users.get(user.id)
    return money
  }

  logTransaction (value, sender, receiver) {
    this.client.log(`${value} Switchcoins were sent from ${sender.id} to ${receiver.id}`, 'Modules', 'Economy')
  }
}
