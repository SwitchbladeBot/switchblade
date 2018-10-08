const { CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Poll extends Command {
  constructor (client) {
    super(client)
    this.name = 'poll'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:poll.noQuestion' })
    )
  }

  run ({ t, author, channel }, question) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const pollPcs = question.split('|')
    if (pollPcs.length > 1) {
      const maxOptions = 26
      if (pollPcs.slice(1).length > maxOptions) {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:poll.tooManyOptions', { maxOptions }))
        channel.send(embed)
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
      embed.setTitle(`:ballot_box: ${question}`)
      channel.send(embed).then(m => {
        m.react('👍').then(() => m.react('👎'))
      })
    }
    channel.stopTyping()
  }
}
