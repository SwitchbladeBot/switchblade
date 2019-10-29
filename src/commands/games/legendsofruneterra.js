const { SubcommandListCommand } = require('../../')

module.exports = class LegendsOfRuneterra extends SubcommandListCommand {
  constructor (client) {
    super(client, {
      name: 'legendsofruneterra',
      aliases: ['lor'],
      category: 'games',
      authorString: 'commands:legendsofruneterra.gameName',
      authorImage: 'https://i.imgur.com/m7Bjs7i.png',
      authorURL: 'https://playruneterra.com'
    })
  }
}
