const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, BooleanParameter } = CommandStructures

module.exports = class ConfigDeleteMessages extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'config')
    this.name = 'deleteMessages'

    this.parameters = new CommandParameters(this,
      new BooleanParameter({ missingError: 'commands:deleteMessage.missingState' })
    )
  }

  async run ({ t, author, channel, guild }, newState) {
    const embed = new SwitchbladeEmbed(author)

    const stateString = newState.toString()
    try {
      await this.client.modules.configuration.deleteUserMessage(guild.id, newState)
      embed.setTitle(`hey, ${stateString}, so it worked i think.`)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'SAME_STATE':
          embed.setTitle('no')
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed)
  }
}
