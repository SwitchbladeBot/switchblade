const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, NumberParameter } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class NumberFacts extends Command {
  constructor (client) {
    super(client)
    this.name = 'numberfacts'
    this.aliases = ['number', 'numfacts', 'numf']

    this.parameters = new CommandParameters(this,
      new NumberParameter({ min: 0, missingError: 'commands:numberfacts.validNumber' })
    )
  }

  async run ({ t, author, channel }, number) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    try {
      const { body } = await snekfetch.get(`http://numbersapi.com/${number}/trivia`)
      embed.setTitle(body)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      embed
        .setTitle(t('commands:numberfacts.validNumber'))
        .setColor(Constants.ERROR_COLOR)
      channel.send(embed).then(() => channel.stopTyping())
    }
  }
}
