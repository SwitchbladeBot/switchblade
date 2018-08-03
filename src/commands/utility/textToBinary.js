const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Binary extends Command {
  constructor (client) {
    super(client)
    this.name = 'binary'
    this.aliases = ['t2b', 'texttobinary', 'ttb']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:binary.missingText'})
    )
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (text.length <= 200) {
      function text2Binary (text) {
        return text.split('').map(function (char) {
          return char.charCodeAt(0).toString(2)
        }).join(' ')
      }
      const binaryText = text2Binary(text)
      embed
        .setTitle(t('commands:binary.textToBinary'))
        .setDescription(binaryText)
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:binary.tooLongTitle'))
        .setDescription(t('commands:binary.tooLongDescription'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
