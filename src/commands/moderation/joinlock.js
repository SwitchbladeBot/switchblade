const { Command, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class JoinLock extends Command {
  constructor (client) {
    super({
      name: 'joinlock',
      aliases: ['jl'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['KICK_MEMBERS'], permissions: ['MANAGE_GUILD'] },
      parameters: [{
        type: 'boolean', missingError: 'commands:joinlock.missingState'
      }]
    }, client)
  }

  async run ({ t, channel, guild, author }, newState) {
    const embed = new SwitchbladeEmbed(author)

    const stateString = newState.toString()
    const currentState = await this.client.modules.joinLock.isActive(guild.id)
    try {
      if (currentState === newState) {
        embed.setTitle(t('commands:joinlock.sameValue', { context: stateString }))
      } else {
        await this.client.modules.joinLock.updateState(guild.id, newState)
        embed.setTitle(`${newState ? '🔒' : '🔓'} ${t('commands:joinlock.success', { context: stateString })}`)
      }
    } catch (e) {
      embed
        .setTitle(t('errors:generic'))
        .setColor(Constants.ERROR_COLOR)
    }

    channel.send(embed)
  }
}
