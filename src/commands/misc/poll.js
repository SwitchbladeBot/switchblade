const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Poll extends Command {
  constructor (client) {
    super(client)
    this.name = 'poll'
  }

  run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:poll.noQuestion'))
        .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:poll.commandUsage')}`)
      message.channel.send(embed)
    } else {
      const pollPcs = args.join(' ').split('|')
      if (pollPcs.length === 1) {
        embed.setTitle(`:ballot_box: ${args.join(' ')}`)
        message.channel.send(embed).then(async m => {
          await m.react('👍')
          await m.react('👎')
        })
      } else {
        const maxOptions = 26
        if (pollPcs.slice(1).length > maxOptions) {
          embed.setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:poll.tooManyOptions', {maxOptions}))
          message.channel.send(embed)
        } else {
          let description = ''
          const alphabet = ('abcdefghijklmnopqrstuvwxyz').split('')
          const unicodeAlphabet = ('🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿').split(' ')
          for (let i = 0; i < pollPcs.slice(1).length; i++) {
            description += `:regional_indicator_${alphabet[i]}: ${pollPcs.slice(1)[i]}\n`
          }
          embed.setTitle(`:ballot_box: ${pollPcs[0]}`)
            .setDescription(description)
          message.channel.send(embed).then(async m => {
            for (let i = 0; i < pollPcs.slice(1).length; i++) {
              await m.react(unicodeAlphabet[i])
            }
          })
        }
      }
    }
    message.channel.stopTyping()
  }
}
