const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class reloadlocales extends Command {
  constructor (client) {
    super(client, {
      name: 'reloadlocales',
      category: 'developers',
      hidden: true,
      requirements: { managersOnly: true }
    })
  }

  async run ({ t, channel, author }) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      this.client.downloadAndInitializeLocales('src/locales').then(() => {
        embed
          .setTitle(t('commands:reloadlocales:reloaded'))
        channel.send(embed).then(() => channel.stopTyping())
      })
    } catch (e) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
      channel.send(embed).then(() => channel.stopTyping())
    }
  }
}
