const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Currency extends Command {
  constructor (client) {
    super(client, {
      name: 'currency',
      aliases: ['currencyconverter', 'converter'],
      category: 'utility',
      requirements: { envVars: ['KSOFT_KEY'] },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:vaporwave.missingSentence'
      }]
    })
  }

  async run ({ t, author, channel }, to, from = 'USD', value = 1) {
    const embed = new SwitchbladeEmbed(author)
    try {
      const { body } = await snekfetch.get('https://api.ksoft.si/kumo/currency').query({ to, from, value }).set({
        'Authorization': `Bearer ${process.env.KSOFT_KEY}`
      })

      if (body.pretty) {
        return channel.send(embed
          .setTitle(`${from.toUpperCase()} ${t('commons:to')} ${to.toUpperCase()}`)
          .setDescription(`${value} ${from.toUpperCase()} = ${body.pretty}`))
      }

      throw new Error('INVALID_REQUEST')
    } catch (e) {
      throw new CommandError(t('commands:currency.noCurrency'), true)
    }
  }
}
