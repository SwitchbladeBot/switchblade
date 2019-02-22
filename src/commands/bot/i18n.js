const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class i18n extends Command {
  constructor (client) {
    super(client, {
      name: 'i18n',
      aliases: ['crowdin'],
      category: 'bot'
    })
  }

  async run ({ t, channel }) {
    const embed = new SwitchbladeEmbed()
    channel.startTyping()
    embed
      .setDescription(`${Constants.CROWDIN_LOGO} ${t('commands:i18n.translateMe')}`)
      .setImage('https://i.imgur.com/UVIAzg0.gif')
    channel.send(embed).then(() => channel.stopTyping())
  }
}
