const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class i18n extends Command {
  constructor (client) {
    super({
      name: 'i18n',
      aliases: ['crowdin'],
      category: 'bot'
    }, client)
  }

  async run ({ t, channel }) {
    const embed = new SwitchbladeEmbed()
    channel.startTyping()
    embed
      .setDescription(`${this.getEmoji('crowdinLogo')} ${t('commands:i18n.translateMe')}`)
      .setImage('https://i.imgur.com/UVIAzg0.gif')
    channel.send(embed).then(() => channel.stopTyping())
  }
}
