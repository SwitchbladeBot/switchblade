const { SubcommandListCommand } = require('../../')

module.exports = class IGDB extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'igdb',
      category: 'games',
      requirements: { apis: ['igdb'] },
      authorString: 'commands:igdb.gameName',
      authorImage: 'https://i.imgur.com/T0iuwzs.jpg',
      authorURL: 'https://igdb.com',
      embedColor: '#9345FA'
    }, client)
  }
}
