const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')
// eslint-disable-next-line no-useless-escape
const EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, '')

module.exports = class Strawpoll extends Command {
  constructor (client) {
    super(client, {
      name: 'strawpoll',
      aliases: ['spoll', 'strawp'],
      parameters: [{
        type: 'string', full: true, missingError: 'commands:strawpoll.noParameters'
      }]
    })
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    const options = EscapeMarkdown(text).split('|')
    const title = options.shift()

    if (options.length >= 2 && options.length <= 30) {
      try {
        channel.startTyping()
        const body = await fetch('https://strawpoll.me/api/v2/polls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, options })
        })

        embed
          .setColor(0xffd756)
          .setAuthor(body.title, 'https://i.imgur.com/Dceju2J.jpg')
          .setDescription(body.options.map(o => `**>** ${o}`).join('\n') + `\n\n[${t('commands:strawpoll.clickHere')}](http://strawpoll.me/${body.id})\n\`http://strawpoll.me/${body.id}\``)
        channel.send(embed).then(() => channel.stopTyping())
      } catch (e) {
        throw new CommandError(t('errors:generic'))
      }
    } else {
      throw new CommandError(t('commands:strawpoll.optionsNumberError'))
    }
  }
}
