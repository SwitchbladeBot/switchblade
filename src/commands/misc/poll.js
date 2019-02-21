const { Command, CommandError, SwitchbladeEmbed } = require('../../')

// eslint-disable-next-line no-useless-escape
const EscapeMarkdown = (text) => text.replace(/(\*|~+|`)/g, '')

module.exports = class Poll extends Command {
  constructor (client) {
    super(client, {
      name: 'poll',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:poll.noQuestion'
      }]
    })
  }

  run ({ t, author, channel }, question) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const pollPcs = EscapeMarkdown(question).split('|')
    if (pollPcs.length > 1) {
      const maxOptions = 26
      if (pollPcs.slice(1).length > maxOptions) {
        throw new CommandError(t('commands:poll.tooManyOptions', { maxOptions }))
      } else {
        let description = ''
        const alphabet = ('abcdefghijklmnopqrstuvwxyz').split('')
        const unicodeAlphabet = ('🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿').split(' ')
        for (let i = 0; i < pollPcs.slice(1).length; i++) {
          description += `:regional_indicator_${alphabet[i]}: ${pollPcs.slice(1)[i]}\n`
        }

        channel.send(embed
          .setTitle(`:ballot_box: ${pollPcs[0]}`)
          .setDescription(description)
        ).then(async m => {
          for (let i = 0; i < pollPcs.slice(1).length; i++) {
            await m.react(unicodeAlphabet[i])
          }
        })
      }
    } else {
      embed.setTitle(`:ballot_box: ${EscapeMarkdown(question)}`)
      channel.send(embed).then(m => {
        m.react('👍').then(() => m.react('👎'))
      })
    }
    channel.stopTyping()
  }
}
