const { SubcommandListCommand } = require('../../')

module.exports = class GenshinImpact extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'genshinimpact',
      aliases: ['genshin', 'gi'],
      category: 'games',
      requirements: { apis: ['genshinimpact'] },
      authorString: 'commands:genshinimpact.gameName',
      authorImage: 'https://i.imgur.com/z6h1q5R.jpg',
      authorURL: 'https://genshin.mihoyo.com/en/',
      embedColor: '#ffffff'
    }, client)
  }
}
