const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class i18n extends Command {
  constructor (client) {
    super(client)
    this.name = 'i18n'
    this.aliases = ['crowdin']
    this.category = 'bot'
  }

  async run ({ t, channel }) {
    channel.send(
      new SwitchbladeEmbed()
        .setDescription(`${Constants.CROWDIN_LOGO} ${t('commands:i18n.TranslateMe')}`)
        .setImage('https://i.imgur.com/UVIAzg0.gif')
    )
  }
}
