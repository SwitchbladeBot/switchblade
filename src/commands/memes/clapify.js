const { Command, SwitchbladeEmbed, Constants } = require('../../index')

const emoji = '\uD83D\uDC4F'
const CLAPIFY_LIMIT = 128

module.exports = class Clapify extends Command {
  constructor (client) {
    super(client, {
      name: 'clapify',
      category: 'memes',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:clapify.missingSentence'
      }]
    })
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    if (text.length >= CLAPIFY_LIMIT) {
      embed
        .setTitle(t('commands:clapify.tooLongText', { limit: CLAPIFY_LIMIT }))
        .setColor(Constants.ERROR_COLOR)
    } else {
      embed.setTitle(`${emoji} ${text.toUpperCase().split(' ').join(` ${emoji} `)} ${emoji}`)
    }
    channel.send(embed)
  }
}
