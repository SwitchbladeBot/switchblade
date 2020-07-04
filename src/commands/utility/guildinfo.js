const { Command, SwitchbladeEmbed, MiscUtils } = require('../../')
const moment = require('moment')

module.exports = class GuildInfo extends Command {
  constructor (client) {
    super({
      name: 'guildinfo',
      aliases: ['serverinfo', 'server', 'guild', 'si', 'gi', 'sinfo', 'ginfo'],
      category: 'utility',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'guild',
        full: true,
        required: false
      }]
    }, client)
  }

  run ({ t, author, channel, language }, guild = channel.guild) {
    const embed = new SwitchbladeEmbed(author)
    moment.locale(language)
    channel.startTyping()
    embed.setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : `https://guild-default-icon.herokuapp.com/${guild.nameAcronym}`)
      .addField(t('commands:guildinfo.id'), guild.id, true)
      .addField(t('commands:guildinfo.owner'), guild.owner, true)
      .addField(t('commands:guildinfo.region'), t(`regions:${guild.region}`), true)
      .addField(t('commands:guildinfo.channels', { count: MiscUtils.formatNumber(guild.channels.cache.size, language) }), [
        t('commands:guildinfo.textChannels', { count: MiscUtils.formatNumber(guild.channels.cache.filter(g => g.type === 'text' || g.type === 'category').size, language) }),
        t('commands:guildinfo.voiceChannels', { count: MiscUtils.formatNumber(guild.channels.cache.filter(g => g.type === 'voice').size, language) })
      ].join('\n'), true)
      .addField(t('commands:guildinfo.createdAt'), `${moment(guild.createdTimestamp).format('LLL')}\n(${moment(guild.createdTimestamp).fromNow()})`, true)
      .addField(t('commands:guildinfo.joinedAt'), `${moment(guild.joinedTimestamp).format('LLL')}\n(${moment(guild.joinedTimestamp).fromNow()})`, true)
      .addField(t('commands:guildinfo.members', { count: MiscUtils.formatNumber(guild.members.cache.size, language) }), [
        `${this.getEmoji('streaming')} ${t('commands:guildinfo.streaming', { count: MiscUtils.formatNumber(guild.members.cache.filter(m => m.game === 'streaming').size, language) })}`,
        `${this.getEmoji('online')} ${t('commands:guildinfo.online', { count: MiscUtils.formatNumber(guild.members.cache.filter(m => m.presence.status === 'online').size, language) })}`,
        `${this.getEmoji('idle')} ${t('commands:guildinfo.idle', { count: MiscUtils.formatNumber(guild.members.cache.filter(m => m.presence.status === 'idle').size, language) })}`,
        `${this.getEmoji('dnd')} ${t('commands:guildinfo.dnd', { count: MiscUtils.formatNumber(guild.members.cache.filter(m => m.presence.status === 'dnd').size, language) })}`,
        `${this.getEmoji('offline')} ${t('commands:guildinfo.offline', { count: MiscUtils.formatNumber(guild.members.cache.filter(m => m.presence.status === 'offline').size, language) })}\n`,
        t('commands:guildinfo.users', { count: MiscUtils.formatNumber(guild.members.cache.filter(m => !m.user.bot).size, language) }),
        t('commands:guildinfo.bots', { count: MiscUtils.formatNumber(guild.members.cache.filter(m => m.user.bot).size, language) })
      ].join('\n'))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
