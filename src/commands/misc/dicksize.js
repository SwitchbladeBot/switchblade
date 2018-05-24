const { Command } = require('../../')

module.exports = class Triggered extends Command {

  run (message) {
    constructor (client) {
    super(client)
    this.name = 'DickSize'
  }
  
  var randnumb = Math.floor((Math.random() * 20) + 1);
    
    message.channel.send(rannumb + ' cm')
  }
}
