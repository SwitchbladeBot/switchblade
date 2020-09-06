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
        acceptSelf: true,
        acceptPartial: true
      }]
    }, client)
  }

  async run ({ t, guild, member: author, channel, language }, member = author) {
    moment.locale(language)
    const isUserPartial = !member.joinedTimestamp
    const createdAt = isUserPartial ? member.createdAt : member.user.createdTimestamp
    const embed = new SwitchbladeEmbed()
      .setTitle(isUserPartial ? member.username : member.displayName)
      .setThumbnail((isUserPartial ? member : member.user).displayAvatarURL({ format: 'png' }))
      .addField(t('commands:userinfo.tag'), isUserPartial ? member.tag : member.user.tag, true)
      .addField(t('commands:userinfo.id'), member.id, true)
      .addField(t('commands:userinfo.status'), t(`commands:userinfo.${member.presence.status}`, { status: this.getEmoji(member.presence.status) }), true)
      .addField(t('commands:userinfo.createdAt'), `${moment(createdAt).format('LLL')}\n(${moment(createdAt).fromNow()})`, true)

    if (!isUserPartial) {
      embed.addField(t('commands:userinfo.joinedAt'), `${moment(member.joinedTimestamp).format('LLL')}\n(${moment(member.joinedTimestamp).fromNow()})`, true)
        .setFooter(`${author.user.tag} - ${t('commands:userinfo.memberNumber', { count: MiscUtils.formatNumber(guild.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).array().indexOf(member) + 1, language) })}`)
    }

    channel.send(embed)
  }
}
