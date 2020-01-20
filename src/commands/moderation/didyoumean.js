const { Command, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class DidYouMean extends Command {
  constructor (client) {
    super({
      name: 'didyoumean',
      aliases: ['dym'],
      category: 'moderation',
      requirements: { guildOnly: true, permissions: ['MANAGE_GUILD'] },
      parameters: [{
        type: 'boolean', missingError: 'commands:didyoumean.missingState'
      }]
    }, client)
  }

  async run ({ t, channel, guild, author }, newState) {
    const embed = new SwitchbladeEmbed(author)

    const stateString = newState.toString()
    const currentState = await this.client.modules.didYouMean.isActive(guild.id)
    try {
      if (currentState === newState) {
        embed.setTitle(t('commands:didyoumean.sameValue', { context: stateString }))
      } else {
        await this.client.modules.didYouMean.updateState(guild.id, newState)
        embed.setTitle(t('commands:didyoumean.success', { context: stateString }))
      }
    } catch (e) {
      embed
        .setTitle(t('errors:generic'))
        .setColor(Constants.ERROR_COLOR)
    }

    channel.send(embed)
  }
}
