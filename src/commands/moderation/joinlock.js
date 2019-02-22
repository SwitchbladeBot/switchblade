const { Command, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class JoinLock extends Command {
  constructor (client) {
    super(client, {
      name: 'joinlock',
      aliases: ['jl'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['KICK_MEMBERS'], permissions: ['MANAGE_GUILD'] },
      parameters: [{
        type: 'boolean', missingError: 'commands:joinlock.missingState'
      }]
    })
  }

  async run ({ t, channel, guild, author }, newState) {
    const embed = new SwitchbladeEmbed(author)

    const stateString = newState.toString()
    try {
      await this.client.modules.moderation.setJoinLock(guild.id, newState)
      embed.setTitle(`${newState ? '🔒' : '🔓'} ${t('commands:joinlock.success', { context: stateString })}`)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'SAME_STATE':
          embed.setTitle(t('commands:joinlock.sameValue', { context: stateString }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed)
  }
}
