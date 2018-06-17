const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Pay extends Command {
  constructor (client) {
    super(client)
    this.name = 'pay'
  }

  run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0] || !message.mentions.members.first()) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:pay.noMember'))
        .setDescription(`**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:pay.commandUsage')}\``)
      message.channel.send(embed).then(() => message.channel.stopTyping())
    } else if (!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) < 1) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:pay.noValue'))
        .setDescription(`**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:pay.commandUsage')}\``)
      message.channel.send(embed).then(() => message.channel.stopTyping())
    } else {
      this.client.database.users.get(message.author.id).then(sender => {
        const valueToTransfer = parseInt(args[1])
        if (valueToTransfer > sender.money) {
          embed.setColor(Constants.ERROR_COLOR)
            .setDescription(t('commands:pay.notEnoughMoney'))
        } else {
          this.client.database.users.get(message.mentions.members.first().id).then(receiver => {
            sender.money -= valueToTransfer
            receiver.money += valueToTransfer
            sender.save()
            receiver.save()
          })
          embed.setDescription(t('commands:pay.transactionSuccessful', { receiver: message.mentions.users.first(), value: valueToTransfer }))
        }
        message.channel.send(embed).then(() => message.channel.stopTyping())
      })
    }
  }
}
