const { SubcommandListCommand } = require('../../../')

module.exports = class Tidal extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'tidal',
      aliases: ['td'],
      requirements: { apis: ['tidal'] },
      authorString: 'commands:tidal.serviceName',
      authorImage: 'https://i.pinimg.com/originals/f2/4d/06/f24d063809c9c16e940fe10162def782.png',
      authorURL: 'https://tidal.com',
      embedColor: '#12161d'
    }, client)
  }
}
