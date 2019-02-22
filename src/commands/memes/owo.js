const { Command, SwitchbladeEmbed } = require('../../')

const Owoify = require('../../utils/Owoify')

module.exports = class OwO extends Command {
  constructor (client) {
    super(client, {
      name: 'owo',
      aliases: ['uwu', 'whatsthis', 'owoify'],
      category: 'memes',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:owo.missingSentence'
      }]
    })
  }

  async run ({ author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setDescription(Owoify(text))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
