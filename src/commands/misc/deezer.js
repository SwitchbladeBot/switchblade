const { SubcommandListCommand } = require('../../')

module.exports = class Deezer extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'deezer',
      aliases: ['dz'],
      requirements: { apis: ['deezer'] },
      authorString: 'commands:deezer.serviceName',
      authorImage: 'https://lh3.googleusercontent.com/r55K1eQcji3QMHRKERq6zE1-csoh_MTOHiKyHTuTOblhFi_rIz06_8GN5-DHUGJOpn79',
      authorURL: 'https://deezer.com'
    }, client)
  }
}
