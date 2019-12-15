const { Command, SwitchbladeEmbed } = require('../../../')

module.exports = class QRCodeGenerate extends Command {
  constructor (client) {
    super({
      name: 'generate',
      aliases: ['create', 'g'],
      parent: 'qrcode',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:qrcode.subcommands.generate.noText'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, text) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}`)
    )
  }
}
