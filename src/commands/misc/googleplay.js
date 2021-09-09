const { SubcommandListCommand, Constants } = require('../../')

module.exports = class GooglePlay extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'googleplay',
      aliases: ['gplay', 'androidmarket'],
      requirements: { apis: ['gplaystore'] },
      authorString: 'commands:googleplay.serviceName',
      authorImage: 'https://i.imgur.com/kLdJwcj.png',
      authorURL: 'https://play.google.com',
      embedColor: Constants.GOOGLEPLAY_COLOR
    }, client)
  }
}
