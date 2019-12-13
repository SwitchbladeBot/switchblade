const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

const EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, '')

const baseURL = 'https://hastebin.com'

module.exports = class Hastebin extends Command {
  constructor (client) {
    super({
      name: 'hastebin',
      aliases: ['haste'],
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:hastebin.missingCode'
      }]
    }, client)
  }

  async run ({ t, author, channel, message }, code) {
    const embed = new SwitchbladeEmbed()
    const { key } = await fetch(`${baseURL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: EscapeMarkdown(code)
    }).then(res => res.json())

    embed
      .setAuthor(t('commands:hastebin.hereIsYourURL'))
      .setDescription(`${baseURL}/${key}`)
    channel.send(embed)
  }
}
