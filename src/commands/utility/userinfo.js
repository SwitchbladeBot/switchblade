const { Command, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const moment = require('moment')

module.exports = class UserInfo extends Command {
  constructor (client) {
    super(client, {
      name: 'userinfo',
      aliases: ['user', 'ui', 'uinfo'],
      category: 'utility',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'member',
        full: true,
        required: false,
        acceptBot: true
      }]
    })
  }

  run ({ t, guild, member: author, channel, language }, member = author) {
    const embed = new SwitchbladeEmbed()
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
