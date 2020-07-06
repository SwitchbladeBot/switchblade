const { SubcommandListCommand } = require('../../')

module.exports = class Spotify extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'spotify',
      aliases: ['sp'],
      requirements: { apis: ['spotify'] },
      authorString: 'commands:spotify.serviceName',
      authorImage: 'https://i.imgur.com/vw8svty.png',
      authorURL: 'https://spotify.com',
      embedColor: '#18d860'
    }, client)
  }
}
