const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class TCDNE extends Command {
  constructor (client) {
    super({
      name: 'tcdne',
      aliases: ['thiscatdoesnotexists'],
      category: 'misc'
    }, client)
  }

  run ({ t, channel, author }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(t('commands:tcdne.cat'))
        .setImage(`https://thiscatdoesnotexist.com/?q=${new Date().getTime()}`)
    )
  }
}
