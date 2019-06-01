const { Command, CommandError, SwitchbladeEmbed } = require('../../../')
const fetch = require('node-fetch')

module.exports = class QRCodeRead extends Command {
  constructor (client) {
    super(client, {
      name: 'read',
      aliases: ['r'],
      parentCommand: 'qrcode',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:qrcode.subcommands.read.noImage'
      }]
    })
  }

  async run ({ t, channel, author, message }, image) {
    const body = await fetch(`http://api.qrserver.com/v1/read-qr-code/?fileurl=${message.attachments.first() ? message.attachments.first().url : image}`).then(res => res.json())
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
