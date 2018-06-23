const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter, MemberParameter } = CommandStructures

module.exports = class Kick extends Command {
  constructor (client) {
    super(client)
    this.name = 'kick'

    this.requirements = new CommandRequirements(this, {guildOnly: true, permissions: ['KICK_MEMBERS']})
    this.parameters = new CommandParameters(this,
      new MemberParameter({missingError: 'commands:kick.noMember'}),
      new StringParameter({full: true, missingError: 'commands:kick.noReason'})
    )
  }

  run ({ t, member: author, channel, guild }, member, reason) {
    const embed = new SwitchbladeEmbed(author.user)
    channel.startTyping()
    if (!guild.me.hasPermission('KICK_MEMBERS')) {
      embed.setTitle(t('commands:kick.noPermissions'))
        .setColor(Constants.ERROR_COLOR)
    } else if (author === member) {
      embed.setTitle(t('commands:kick.cantKickYourself'))
        .setcolor(Constants.ERROR_COLOR)
    } else if (!member.kickable) {
      embed.setTitle(t('commands:kick.cantKick'))
        .setColor(Constants.ERROR_COLOR)
    } else if (author.highestRole.position < member.highestRole.position) {
      embed.setTitle(t('commands:kick.lowerPosition'))
        .setColor(Constants.ERROR_COLOR)
    } else {
      member.send(t('commands:kick.youHaveBeenKicked', { guild, author, reason }))
      member.kick(reason)
      embed.setDescription(t('commands:kick.kicked', { member }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
