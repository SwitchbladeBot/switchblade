const { Command, CommandError, SwitchbladeEmbed } = require('../../../')
const fetch = require('node-fetch')

module.exports = class QRCodeRead extends Command {
  constructor (client) {
    super({
      name: 'read',
      aliases: ['r'],
      parent: 'qrcode',
      parameters: [{
        type: 'image',
        authorAvatar: false,
        url: true,
        missingError: 'commands:qrcode.subcommands.read.noImage'
      }]
    }, client)
  }

  async run ({ t, channel, author, message }, image) {
    const body = await fetch(`http://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(image)}`).then(res => res.json())
    if (body[0].symbol[0].data !== null) {
      channel.send(
        new SwitchbladeEmbed(author)
          .setDescription(body[0].symbol[0].data)
      )
    } else {
      throw new CommandError(t('commands:qrcode.subcommands.read.unknownImage'))
    }
  }
}
