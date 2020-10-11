const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class ConfigPrefix extends Command {
  constructor (client) {
    super({
      name: 'prefix',
      parent: 'config',
      parameters: [{
        type: 'string',
        full: true,
        required: false,
        maxLength: 50,
        missingError: 'commands:config.subcommands.prefix.noPrefix'
      }]
    }, client)
  }

  async run ({ t, author, channel, guild }, prefix = process.env.PREFIX) {
    const embed = new SwitchbladeEmbed(author)

    try {
      await this.client.modules.prefix.updateValues(guild.id, { prefix })
      embed.setTitle(t('commands:config.subcommands.prefix.changedSuccessfully', { prefix }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
    }

    channel.send(embed)
  }
}
