const { Command, SwitchbladeEmbed } = require('../../')
const pirateSpeak = require('pirate-speak')

module.exports = class PirateSpeak extends Command {
  constructor (client) {
    super({
      name: 'piratespeak',
      aliases: ['ps', 'yarrspeak'],
      category: 'memes',
      parameters: [{
        type: 'string', full: true, clean: true, missingError: 'commands:piratespeak.missingSentence'
      }]
    }, client)
  }

  async run ({ author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription(pirateSpeak.translate(text))
    channel.send(embed)
  }
}
