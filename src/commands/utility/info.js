const { SubcommandListCommand } = require('../../')

module.exports = class Info extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'info',
      authorString: 'commands:info.embedAuthor'
    }, client)
  }
}
