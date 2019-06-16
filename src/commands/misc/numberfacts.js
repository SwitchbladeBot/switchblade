const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class NumberFacts extends Command {
  constructor (client) {
    super(client, {
      name: 'numberfacts',
      aliases: ['number', 'numfacts', 'numf'],
      parameters: [{
        type: 'number', min: 0, missingError: 'commands:numberfacts.validNumber'
      }]
    })
  }

  async run ({ t, author, channel }, number) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    try {
      const body = await fetch(`http://numbersapi.com/${number}/trivia`).then(res => res.json())
      embed.setTitle(body)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:numberfacts.validNumber')).then(() => channel.stopTyping())
    }
  }
}
