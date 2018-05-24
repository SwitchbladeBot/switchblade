const { Command, Math } = require('../../')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client)
    this.name = 'dicksize'
  }
  
  var randnumb = Math.floor((Math.random() * 20) + 1);

  async run (message) {
    message.channel.send(rannumb + ' cm')
  }
}