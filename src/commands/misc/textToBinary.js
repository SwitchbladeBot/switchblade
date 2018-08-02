const { CommandStructures, SwitchbladeEmbed } = require('../../')
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
    function text2Binary (text) {
      return text.split('').map(function (char) {
        return char.charCodeAt(0).toString(2)
      }).join(' ')
    }
    const binaryText = text2Binary(text)
    embed
      .setTitle(t('commands:binary.textToBinary'))
      .setDescription(binaryText)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
