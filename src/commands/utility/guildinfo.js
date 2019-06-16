const { Command, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const moment = require('moment')

module.exports = class GuildInfo extends Command {
  constructor (client) {
    super(client, {
      name: 'guildinfo',
      aliases: ['serverinfo', 'server', 'guild', 'si', 'gi', 'sinfo', 'ginfo'],
      category: 'utility',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'guild',
        full: true,
        required: false
      }]
    })
  }

  run ({ t, author, channel, language }, guild = channel.guild) {
    const embed = new SwitchbladeEmbed(author)
    moment.locale(language)
    channel.startTyping()
    embed.setTitle(guild.name)
      .setThumbnail(guild.iconURL ? guild.iconURL : `https://guild-default-icon.herokuapp.com/${guild.nameAcronym}`)
      .addField(t('commands:guildinfo.id'), guild.id, true)
      .addField(t('commands:guildinfo.owner'), guild.owner, true)
      .addField(t('commands:guildinfo.region'), t(`regions:${guild.region}`), true)
      .addField(t('commands:guildinfo.channels', { count: MiscUtils.formatNumber(guild.channels.size, language) }), [
        t('commands:guildinfo.textChannels', { count: MiscUtils.formatNumber(guild.channels.filter(g => g.type === 'text' || g.type === 'category').size, language) }),
        t('commands:guildinfo.voiceChannels', { count: MiscUtils.formatNumber(guild.channels.filter(g => g.type === 'voice').size, language) })
      ].join('\n'), true)
      .addField(t('commands:guildinfo.createdAt'), `${moment(guild.createdTimestamp).format('LLL')}\n(${moment(guild.createdTimestamp).fromNow()})`, true)
      .addField(t('commands:guildinfo.joinedAt'), `${moment(guild.joinedTimestamp).format('LLL')}\n(${moment(guild.joinedTimestamp).fromNow()})`, true)
      .addField(t('commands:guildinfo.members', { count: MiscUtils.formatNumber(guild.members.size, language) }), [
        `${Constants.STREAMING_STATUS} ${t('commands:guildinfo.streaming', { count: MiscUtils.formatNumber(guild.members.filter(m => m.game === 'streaming').size, language) })}`,
        `${Constants.ONLINE_STATUS} ${t('commands:guildinfo.online', { count: MiscUtils.formatNumber(guild.members.filter(m => m.presence.status === 'online').size, language) })}`,
        `${Constants.IDLE_STATUS} ${t('commands:guildinfo.idle', { count: MiscUtils.formatNumber(guild.members.filter(m => m.presence.status === 'idle').size, language) })}`,
        `${Constants.DND_STATUS} ${t('commands:guildinfo.dnd', { count: MiscUtils.formatNumber(guild.members.filter(m => m.presence.status === 'dnd').size, language) })}`,
        `${Constants.OFFLINE_STATUS} ${t('commands:guildinfo.offline', { count: MiscUtils.formatNumber(guild.members.filter(m => m.presence.status === 'offline').size, language) })}\n`,
        t('commands:guildinfo.users', { count: MiscUtils.formatNumber(guild.members.filter(m => !m.user.bot).size, language) }),
        t('commands:guildinfo.bots', { count: MiscUtils.formatNumber(guild.members.filter(m => m.user.bot).size, language) })
      ].join('\n'))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
