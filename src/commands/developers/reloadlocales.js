const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
module.exports = class reloadlocales extends Command {
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
        embed
          .setTitle(t('commands:reloadlocales:reloaded'))
        channel.send(embed)
      })
    } catch (e) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
      channel.send(embed)
    }
  }
}
