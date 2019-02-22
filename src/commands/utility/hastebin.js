const { Command, SwitchbladeEmbed, Constants } = require('../../')

const snekfetch = require('snekfetch')

const baseURL = 'https://hastebin.com'

module.exports = class Hastebin extends Command {
  constructor (client) {
    super(client, {
      name: 'hastebin',
      aliases: 'haste',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:hastebin.missingCode'
      }]
    })
  }

  async run ({ t, author, channel, message }, code) {
    const { body } = await snekfetch.post(`${baseURL}/documents`).set('Content-Type', 'application/json').send(message.content)
    channel.send(`${baseURL}/${body.key}`)
  }
}
