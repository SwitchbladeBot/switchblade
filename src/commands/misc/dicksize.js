const { Command } = require('../../')

module.exports = class DickSize extends Command {
  constructor (client) {
    super(client)
    this.name = 'dicksize'
    this.aliases = ['peepeesize', 'weinersize']
  }

  run (message) {
    if message.channel.nsfw {
      var randnumb = Math.floor((Math.random() * 20) + 1);
      message.channel.send(rannumb + ' cm') 
    } else {
      message.channel.send('This is a NSFW-only command. It only works in NSFW channels.') 
    }
  }
}
