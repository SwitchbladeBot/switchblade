const { Command } = require('../../')
const request = require('request')

module.exports = class Tinyurl extends Command {
  constructor (client) {
    super(client, {
      name: 'tinyurl',
      aliases: ['short', 'shorturl']
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:tinyurl.missingSentence'
      }]
    })
  }

  async run ({ t, author, channel }, text) {
   channel.startTyping()
   request(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`, function (e, r, b) {
   channel.send(b)
 }).then(() => channel.stopTyping())
}
