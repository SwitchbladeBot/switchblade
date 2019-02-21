const { Command, SwitchbladeEmbed, Constants } = require('../../')
const BinaryRegex = '(?=^1*(01*0)*1*$)^.(..)*$'

module.exports = class Binary extends Command {
  constructor (client) {
    super(client, {
      name: 'binary',
      aliases: ['t2b', 'texttobinary', 'ttb'],
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:binary.missingText'
      }]
    })
  }

  async run ({ t, author, channel }, input) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (input.length <= 200) {
      if (input.match(BinaryRegex)) {
        embed
          .setTitle(t('commands:binary.binaryToText'))
          .setDescription(this.binaryToText(input))
      } else {
        embed
          .setTitle(t('commands:binary.textToBinary'))
          .setDescription(this.textToBinary(input))
      }
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:binary.tooLongTitle'))
        .setDescription(t('commands:binary.tooLongDescription'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }

  textToBinary (text) {
    return text.split('').map(function (char) {
      return char.charCodeAt(0).toString(2)
    }).join(' ')
  }

  binaryToText (binary) {
    return parseInt(binary, 2).toString(10)
  }
}
