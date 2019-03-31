const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class ConfigPrefix extends Command {
  constructor (client, parentCommand) {
    super(client, {
      name: 'prefix',
      parentCommand: 'config',
      parameters: [{
        type: 'string',
        full: true,
        required: false,
        maxLength: 50,
        missingError: 'commands:config.subcommands.prefix.noPrefix'
      }]
    })
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
