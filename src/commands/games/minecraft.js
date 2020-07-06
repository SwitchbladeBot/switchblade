const { SubcommandListCommand } = require('../../')

module.exports = class Minecraft extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'minecraft',
      aliases: ['minecraftquery', 'mc', 'mcquery'],
      category: 'games',
      authorString: 'commands:minecraft.gameName',
      authorImage: 'https://i.imgur.com/DBkQ0K5.png',
      authorURL: 'https://minecraft.net'
    }, client)
  }
}
