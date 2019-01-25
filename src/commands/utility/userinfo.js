const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const { Command, CommandRequirements, CommandParameters, MemberParameter } = CommandStructures
const moment = require('moment')

module.exports = class UserInfo extends Command {
  constructor (client) {
    super(client)
    this.name = 'userinfo'
    this.aliases = ['user', 'ui', 'uinfo']
    this.category = 'utility'
    this.requirements = new CommandRequirements(this, { guildOnly: true })
    this.parameters = new CommandParameters(this,
      new MemberParameter({ full: true, required: false, acceptBot: true })
    )
  }

  run ({ t, guild, member: author, channel, language }, member) {
    const embed = new SwitchbladeEmbed()
    member = member || author
    moment.locale(language)
    const filter = this.client.guilds.filter(g => g.members.has(member.id)).map(g => g.name)
    const charLimit = (s) => s.length > 1024 ? `${s.substr(0, 1020)}...` : s
    channel.startTyping()

    embed.setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL)
      .addField(t('commands:userinfo.tag'), member.user.tag, true)
      .addField(t('commands:userinfo.id'), member.id, true)
      .addField(t('commands:userinfo.status'), t(`commands:userinfo.${member.presence.status}`, { Constants }), true)
      .addField(t('commands:userinfo.createdAt'), `${moment(member.user.createdTimestamp).format('LLL')}\n(${moment(member.user.createdTimestamp).fromNow()})`, true)
      .addField(t('commands:userinfo.joinedAt'), `${moment(member.joinedTimestamp).format('LLL')}\n(${moment(member.joinedTimestamp).fromNow()})`, true)
      .addField(t('commands:userinfo.serversInCommon', { count: MiscUtils.formatNumber(filter.length, language) }), charLimit(filter.join(', ')))
      .setFooter(`${author.user.tag} - ${t('commands:userinfo.memberNumber', { count: MiscUtils.formatNumber(guild.members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).array().indexOf(member) + 1, language) })}`)

    channel.send(embed).then(() => channel.stopTyping())
  }
}
