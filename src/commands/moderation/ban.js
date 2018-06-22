const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter, MemberParameter } = CommandStructures

module.exports = class Ban extends Command {
  constructor (client) {
    super(client)
    this.name = 'ban'

    this.requirements = new CommandRequirements(this, {guildOnly: true, permissions: ['BAN_MEMBERS']})
    this.parameters = new CommandParameters(this,
      new MemberParameter({missingError: 'commands:ban.noMember'}),
      new StringParameter({full: true, missingError: 'commands:ban.noReason'})
    )
  }

  run ({ t, member: author, channel, guild }, member, reason) {
    const embed = new SwitchbladeEmbed(author.user)
    channel.startTyping()
    if (!guild.me.hasPermission('BAN_MEMBERS')) {
      embed.setTitle(t('commands:ban.noPermissions'))
        .setColor(Constants.ERROR_COLOR)
    } else if (author === member) {
      embed.setTitle(t('commands:ban.cantBanYourself'))
        .setcolor(Constants.ERROR_COLOR)
    } else if (!member.bannable) {
      embed.setTitle(t('commands:ban.cantBan'))
        .setColor(Constants.ERROR_COLOR)
    } else if (author.highestRole.position < member.highestRole.position) {
      embed.setTitle(t('commands:ban.lowerPosition'))
        .setColor(Constants.ERROR_COLOR)
    } else {
      member.send(t('commands:ban.youHaveBeenBanned', { guild, author, reason }))
      guild.ban(member, { days: 7, reason })
      embed.setDescription(t('commands:ban.banned', { member }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
