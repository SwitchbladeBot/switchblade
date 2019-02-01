const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class ConfigPrefix extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'config')
    this.name = 'prefix'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: false, missingError: 'commands:config.subcommands.prefix.noPrefix' })
    )
  }

  async run ({ t, author, channel, guild }, prefix = process.env.PREFIX) {
    const embed = new SwitchbladeEmbed(author)

    try {
      await this.client.modules.configuration.setPrefix(guild.id, prefix)
      embed.setTitle(t('commands:config.subcommands.prefix.changedSuccessfully', { prefix }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
    }

    channel.send(embed)
  }
}
