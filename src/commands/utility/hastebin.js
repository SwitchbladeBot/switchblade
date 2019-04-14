const { Command, SwitchbladeEmbed } = require('../../')

const snekfetch = require('snekfetch')

const EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, '')

const baseURL = 'https://hastebin.com'

module.exports = class Hastebin extends Command {
  constructor (client) {
    super(client, {
      name: 'hastebin',
      aliases: ['haste'],
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:hastebin.missingCode'
      }]
    })
  }

  async run ({ t, author, channel, message }, code) {
    const embed = new SwitchbladeEmbed()
    const { body } = await snekfetch.post(`${baseURL}/documents`).set('Content-Type', 'application/json').send(EscapeMarkdown(code))

    embed
      .setAuthor(t('commands:hastebin.hereIsYourURL'))
      .setDescription(`${baseURL}/${body.key}`)
    channel.send(embed)
  }
}
