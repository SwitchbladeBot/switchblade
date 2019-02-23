const { Command } = require('../../')
const fetch = require('node-fetch')

module.exports = class Tinyurl extends Command {
  constructor (client) {
    super(client, {
      name: 'tinyurl',
      aliases: ['short', 'shorturl'],
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
   fetch(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`).then(shorturl => {
	   channel.send(shorturl)
   })
   channel.stopTyping()
 }
}
