const { Command, SwitchbladeEmbed } = require('../../')
const pirateSpeak = require('pirate-speak')

module.exports = class PirateSpeak extends Command {
  constructor (client) {
    super(client, {
      name: 'piratespeak',
      aliases: ['ps', 'yarrspeak'],
      category: 'memes',
      parameters: [{
        type: 'string', full: true, clean: true, missingError: 'commands:piratespeak.missingSentence'
      }]
    })
  }

  async run ({ author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setDescription(pirateSpeak.translate(text))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
