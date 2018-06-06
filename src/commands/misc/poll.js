const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Poll extends Command {
  constructor (client) {
    super(client)
    this.name = 'poll'
  }

  run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('You need to give me a question to make a poll')
        .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <question> [| answer 1 | answer 2 | answer 3 | ...]`)
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
        if (pollPcs.slice(1).length > 26) {
          embed.setColor(Constants.ERROR_COLOR)
            .setTitle('Can\'t exceed more than 26 options')
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
