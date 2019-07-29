const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Support extends Command {
  constructor (client) {
    super(client, {
      name: 'support',
      category: 'bot'
    })
  }

  async run ({ t, channel }) {
    channel.send(
      new SwitchbladeEmbed()
        .setImage('https://i.imgur.com/wuuQaZu.png')
        .setDescription(`${this.getEmoji('discordLogo')} ${t('commands:support.clickHere')}`)
    )
  }
}
