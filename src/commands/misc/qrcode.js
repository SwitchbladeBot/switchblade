const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class QRCode extends Command {
  constructor (client) {
    super(client)

    this.name = 'qrcode'
    this.aliases = ['qr']
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:qrcode.noText' })
    )
  }

  async run ({ t, author, channel }, text) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}`)
    )
  }
}
