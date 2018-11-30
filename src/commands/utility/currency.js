const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class Currency extends Command {
  constructor (client) {
    super(client)
    this.name = 'currency'
    this.aliases = ['currencyconverter', 'converter']
    this.category = 'utility'
  }

  async run ({ t, author, channel, guildDocument }, tocoin, fromcoin, value) {
    const embed = new SwitchbladeEmbed(author)
    fromcoin = fromcoin || 'USD'
    value = value || 1
    try {
      const { body } = await snekfetch.get(`https://api.ksoft.si/kumo/currency?from=${fromcoin}&to=${tocoin}&value=${value}`, {
        headers: {
          'Authorization': `Bearer ${process.env.KSOFT_KEY}`
        }
      })
      if (body.pretty) {
        embed
          .setTitle(`${fromcoin.toUpperCase()} ${t('commons:to')} ${tocoin.toUpperCase()}`)
          .setDescription(`${value} ${fromcoin.toUpperCase()} = ${body.pretty}`)
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:currency.noCurrency'))
          .setDescription(`**${t('commons:usage')}**: \`${guildDocument.prefix}currency ${t('commands:currency.commandUsage')}\``)
      }
    } catch (e) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:currency.noCurrency'))
        .setDescription(`**${t('commons:usage')}**: \`${guildDocument.prefix}currency ${t('commands:currency.commandUsage')}\``)
    }
    channel.send(embed)
  }
}
