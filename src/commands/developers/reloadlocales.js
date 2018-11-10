const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class ReloadLocales extends Command {
  constructor (client) {
    super(client)
    this.name = 'reloadlocales'
    this.category = 'developers'
    this.hidden = true

    this.requirements = new CommandRequirements(this, { devOnly: true })
  }

  async run ({ t, channel, author }) {
    const embed = new SwitchbladeEmbed(author)
    try {
      this.client.downloadAndInitializeLocales('src/locales').then(() => {
        channel.send(embed.setTitle(t('commands:reloadlocales.reloaded')))
      })
    } catch (e) {
      channel.send(
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('errors:generic'))
          .setDescription(`\`${e.message}\``)
      )
    }
  }
}
