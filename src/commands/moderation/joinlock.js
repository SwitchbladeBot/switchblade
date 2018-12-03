const { CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, BooleanParameter } = CommandStructures

module.exports = class JoinLock extends Command {
  constructor (client) {
    super(client)
    this.name = 'joinlock'
    this.aliases = ['jl']
    this.category = 'moderation'

    this.requirements = new CommandRequirements(this, { guildOnly: true, botPermissions: ['KICK_MEMBERS'], permissions: ['MANAGE_GUILD'] })
    this.parameters = new CommandParameters(this,
      new BooleanParameter({ missingError: 'commands:joinlock.missingState' })
    )
  }

  async run ({ channel, guild, author, guildDocument, t }, newState) {
    guildDocument = guildDocument || await this.client.database.guilds.get(guild.id)
    const embed = new SwitchbladeEmbed(author)
    if (guildDocument.joinLock === newState) {
      embed.setColor(Constants.ERROR_COLOR).setTitle(t(`commands:joinlock.sameValue`, { context: newState.toString() }))
    } else {
      guildDocument.joinLock = newState
      guildDocument.save()
      embed.setTitle(`${newState ? '🔒' : '🔓'} ${t('commands:joinlock.success', { context: newState.toString() })}`)
    }
    channel.send(embed)
  }
}
