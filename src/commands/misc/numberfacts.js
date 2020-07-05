const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class NumberFacts extends Command {
  constructor (client) {
    super({
      name: 'numberfacts',
      aliases: ['number', 'numfacts', 'numf'],
      parameters: [{
        type: 'number', min: 0, missingError: 'commands:numberfacts.validNumber'
      }]
    }, client)
  }

  async run ({ t, author, channel }, number) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    try {
      const body = await fetch(`http://numbersapi.com/${number}/trivia`).then(res => res.text())
      embed.setTitle(body)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      console.error(e)
      throw new CommandError(t('commands:numberfacts.anErrorOcurred'))
    }
  }
}
