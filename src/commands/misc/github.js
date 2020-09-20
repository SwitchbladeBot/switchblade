const { SubcommandListCommand } = require('../../')

module.exports = class GitHub extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'github',
      aliases: ['gh'],
      requirements: { apis: ['github'] },
      authorString: 'commands:github.serviceName',
      authorImage: 'https://i.imgur.com/gsY6oYB.png',
      authorURL: 'https://github.com',
      embedColor: '#24292e'
    }, client)
  }
}
