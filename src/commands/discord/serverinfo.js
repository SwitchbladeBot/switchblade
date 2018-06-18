const { Command, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

module.exports = class ServerInfo extends Command {
  constructor (client) {
    super(client)
    this.name = 'serverinfo'
    this.aliases = ['server', 'guildinfo', 'guild']
  }

  run ({ t, author, channel, guild }, expression) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    embed.setAuthor(guild.name, guild.iconURL ? guild.iconURL : 'https://i.imgur.com/o0P9VYp.jpg')
      .addField(t('commands:serverInfo.id'), guild.id, true)
      .addField(t('commands:serverInfo.owner'), guild.owner, true)
      .addField(t('commands:serverInfo.region'), guild.region, true)
      .addField(t('commands:serverInfo.channels', { count: guild.channels.size }), [
        t('commands:serverInfo.textChannels', { count: guild.channels.filter(g => g.type === 'text' || g.type === 'category').size }),
        t('commands:serverInfo.voiceChannels', { count: guild.channels.filter(g => g.type === 'voice').size })
      ].join('\n'), true)
      .addField(t('commands:serverInfo.createdAt'), moment(guild.createdTimestamp).format('DD/MM/YYYY HH:MM'), true)
      .addField(t('commands:serverInfo.joinedAt'), moment(guild.joinedTimestamp).format('DD/MM/YYYY HH:MM'), true)
      .addField(t('commands:serverInfo.members', { count: guild.members.size }), [
        [
          `${Constants.ONLINE_STATUS} ${t('commands:serverInfo.online', { count: guild.members.filter(m => m.presence.status === 'online').size })}`,
          `${Constants.IDLE_STATUS} ${t('commands:serverInfo.away', { count: guild.members.filter(m => m.presence.status === 'idle').size })}`,
          `${Constants.BUSY_STATUS} ${t('commands:serverInfo.dnd', { count: guild.members.filter(m => m.presence.status === 'dnd').size })}`,
          `${Constants.OFFLINE_STATUS} ${t('commands:serverInfo.offline', { count: guild.members.filter(m => m.presence.status === 'offline').size })}`
        ].join(' |'),
        [
          t('commands:serverInfo.users', { count: guild.members.filter(m => !m.user.bot).size }),
          t('commands:serverInfo.bots', { count: guild.members.filter(m => m.user.bot).size })
        ].join('\n')
      ].join('\n'))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
