const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class ConfigDeleteMessages extends Command {
  constructor (client, parentCommand) {
    super(client, {
      name: 'deleteMessages',
      parentCommand: 'config',
      parameters: [{
        type: 'boolean',
        missingError: 'commands:deleteMessage.missingState'
      }]
    })
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
