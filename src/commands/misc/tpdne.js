const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class TPDNE extends Command {
  constructor (client) {
    super({
      name: 'tpdne',
      aliases: ['thispersondoesnotexist']
    }, client)
  }

  run ({ t, channel, author }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(t('commands:tpdne.person'))
        .setImage(`https://thispersondoesnotexist.com/image?q=${new Date().getTime()}`)
    )
  }
}
