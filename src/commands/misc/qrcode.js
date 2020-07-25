const { SubcommandListCommand } = require('../../')

module.exports = class QRCode extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'qrcode',
      aliases: ['qr'],
      authorString: 'commands:qrcode.title'
    }, client)
  }
}
