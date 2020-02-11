const { SubcommandListCommand } = require('../../')

module.exports = class LeagueOfLegends extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'leagueoflegends',
      aliases: ['lol'],
      category: 'games',
      requirements: { apis: ['lol'] },
      authorString: 'commands:leagueoflegends.gameName',
      authorImage: 'https://i.imgur.com/4dKfQZn.jpg',
      authorURL: 'https://leagueoflegends.com',
      embedColor: '#002366'
    }, client)
  }
}
