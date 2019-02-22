const { Command, SwitchbladeEmbed, Constants } = require('../../')

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
        .setDescription(`${Constants.DISCORD_LOGO} ${t('commands:support.clickHere')}`)
    )
  }
}
