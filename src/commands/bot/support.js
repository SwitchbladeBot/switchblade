const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Support extends Command {
  constructor (client) {
    super(client)
    this.name = 'support'
    this.category = 'bot'
  }

  async run ({ t, channel }) {
    channel.send(
      new SwitchbladeEmbed()
        .setImage('https://i.imgur.com/FDemvyo.png')
        .setDescription(`${Constants.DISCORD_LOGO} ${t('commands:support.clickHere')}`)
    )
  }
}
