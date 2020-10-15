const { SubcommandListCommand } = require('../../')

module.exports = class Covid extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'covid',
      aliases: ['covid19', 'coronavirus'],
      authorString: 'commands:covid.covid',
      authorImage: 'https://i.imgur.com/Rnobe3k.png',
      authorURL: 'https://covid19.who.int/'
    }, client)
  }
}
