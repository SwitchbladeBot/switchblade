const { Command, SwitchbladeEmbed, MiscUtils } = require('../../')
const moment = require('moment')

module.exports = class UserInfo extends Command {
  constructor (client) {
    super({
      name: 'userinfo',
      aliases: ['user', 'ui', 'uinfo'],
      category: 'utility',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'member',
        full: true,
        required: false,
        acceptBot: true,
        acceptSelf: true
      }]
    }, client)
  }

  run ({ t, guild, member: author, channel, language }, member = author) {
    moment.locale(language)
    channel.send(
      new SwitchbladeEmbed()
        .setTitle(member.displayName)
        .setThumbnail(member.user.displayAvatarURL({ format: 'png' }))
        .addField(t('commands:userinfo.tag'), member.user.tag, true)
        .addField(t('commands:userinfo.id'), member.id, true)
        .addField(t('commands:userinfo.status'), t(`commands:userinfo.${member.presence.status}`, { status: this.getEmoji(member.presence.status) }), true)
        .addField(t('commands:userinfo.createdAt'), `${moment(member.user.createdTimestamp).format('LLL')}\n(${moment(member.user.createdTimestamp).fromNow()})`, true)
        .addField(t('commands:userinfo.joinedAt'), `${moment(member.joinedTimestamp).format('LLL')}\n(${moment(member.joinedTimestamp).fromNow()})`, true)
        .setFooter(`${author.user.tag} - ${t('commands:userinfo.memberNumber', { count: MiscUtils.formatNumber(guild.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).array().indexOf(member) + 1, language) })}`)
    )
  }
}
