const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandError, CommandParameters, NumberParameter, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class Currency extends Command {
  constructor (client) {
    super(client)
    this.name = 'currency'
    this.aliases = ['currencyconverter', 'converter']
    this.category = 'utility'
    this.envVars = ['KSOFT_KEY']

    this.parameters = new CommandParameters(this,
      new StringParameter({ required: false }),
      new NumberParameter({ required: false, min: 1 }),
      new StringParameter({ missingError: 'commands:currency.noCurrency' })
    )
  }

  async run ({ t, author, channel }, from = 'USD', value = 1, to) {
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
