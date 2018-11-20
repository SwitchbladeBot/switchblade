const { Command, SwitchbladeEmbed } = require('../..')
const snekfetch = require('snekfetch')

module.exports = class Bitcoin extends Command {
  constructor (client) {
    super(client)
    this.name = 'bitcoin'
    this.aliases = ['bitcoinvalue', 'btc', 'btcvalue']
    this.category = 'utility'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('https://api.coinbase.com/v2/prices/spot?currency=USD')
    embed.setTitle(t('commands:bitcoin.commandTitle'))
      embed.setDescription(body.data.amount)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
