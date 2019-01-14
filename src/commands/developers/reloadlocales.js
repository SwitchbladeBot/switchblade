const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandError } = CommandStructures
module.exports = class ReloadLocales extends Command {
  constructor (client) {
    super(client)
    this.name = 'reloadlocales'
    this.category = 'developers'
    this.hidden = true

    this.requirements = new CommandRequirements(this, { managersOnly: true })
  }

  async run ({ t, channel, author }) {
    channel.startTyping()
    try {
      await this.client.downloadAndInitializeLocales('src/locales')
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:reloadlocales:reloaded'))
      )
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
    channel.stopTyping()
  }
}
