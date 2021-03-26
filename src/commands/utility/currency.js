const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')

module.exports = class Currency extends Command {
  constructor (client) {
    super({
      name: 'currency',
      aliases: ['currencyconverter', 'converter'],
      category: 'utility',
      requirements: { envVars: ['KSOFT_KEY'] },
      parameters: [{
        type: 'string',
        required: false
      }, {
        type: 'number',
        required: false,
        min: 1
      }, {
        type: 'string',
        missingError: 'commands:currency.noCurrency'
      }]
    }, client)
  }

  async run ({ t, author, channel }, from = 'USD', value = 1, to) {
    const embed = new SwitchbladeEmbed(author)
    try {
      const params = new URLSearchParams({ to, from, value })
      const { pretty } = await fetch(`https://api.ksoft.si/kumo/currency?${params.toString()}`, {
        headers: { Authorization: `Bearer ${process.env.KSOFT_KEY}` }
      }).then(res => res.json())

      if (pretty) {
        return channel.send(embed
          .setTitle(`${from.toUpperCase()} ${t('commons:to')} ${to.toUpperCase()}`)
          .setDescription(`${value} ${from.toUpperCase()} = ${pretty}`))
      }

      throw new Error('INVALID_REQUEST')
    } catch (e) {
      throw new CommandError(t('commands:currency.noCurrency'), true)
    }
  }
}
