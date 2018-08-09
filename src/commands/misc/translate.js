const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Translate extends Command {
  constructor (client) {
    super(client)
    this.name = 'translate'
    this.aliases = ['crowdin']
  }

  async run ({ t, channel }) {
    const embed = new SwitchbladeEmbed()
    channel.startTyping()
    embed
      .setDescription(`${Constants.CROWDIN_LOGO} ${t('commands:translate.TranslateMe')}`)
      .setImage('https://i.imgur.com/LpmnaYd.png')
    channel.send(embed).then(() => channel.stopTyping())
  }
}
