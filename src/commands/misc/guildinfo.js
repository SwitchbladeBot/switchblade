const { CommandStructures, SwitchbladeEmbed, Constants, CommandParameters } = require('../../')
const { Command, CommandRequirements, GuildParameter } = CommandStructures
const moment = require('moment')

module.exports = class GuildInfo extends Command {
  constructor (client) {
    super(client)
    this.name = 'guildinfo'
    this.aliases = ['serverinfo', 'server', 'guild', 'si', 'gi', 'sinfo', 'ginfo']
    this.requirements = new CommandRequirements(this, { guildOnly: true })

    this.parameters = new CommandParameters(this,
      new GuildParameter({full: true, required: false})
    )
  }

  run ({ t, author, channel, guildDocument }, guild) {
    const embed = new SwitchbladeEmbed(author)
    moment.locale(guildDocument.language)
    channel.startTyping()
    guild = guild || channel.guild
    embed.setTitle(guild.name)
      .setThumbnail(guild.iconURL ? guild.iconURL : 'https://i.imgur.com/o0P9VYp.jpg')
      .addField(t('commands:guildinfo.id'), guild.id, true)
      .addField(t('commands:guildinfo.owner'), guild.owner, true)
      .addField(t('commands:guildinfo.region'), t(`regions:${guild.region}`), true)
      .addField(t('commands:guildinfo.channels', { count: guild.channels.size }), [
        t('commands:guildinfo.textChannels', { count: guild.channels.filter(g => g.type === 'text' || g.type === 'category').size }),
        t('commands:guildinfo.voiceChannels', { count: guild.channels.filter(g => g.type === 'voice').size })
      ].join('\n'), true)
      .addField(t('commands:guildinfo.createdAt'), moment(guild.createdTimestamp).format('LLL'), true)
      .addField(t('commands:guildinfo.joinedAt'), moment(guild.joinedTimestamp).format('LLL'), true)
      .addField(t('commands:guildinfo.members', { count: guild.members.size }), [
        `${Constants.STREAMING_STATUS} ${t('commands:guildinfo.streaming', { count: guild.members.filter(m => m.game === 'streaming').size })}`,
        `${Constants.ONLINE_STATUS} ${t('commands:guildinfo.online', { count: guild.members.filter(m => m.presence.status === 'online').size })}`,
        `${Constants.IDLE_STATUS} ${t('commands:guildinfo.idle', { count: guild.members.filter(m => m.presence.status === 'idle').size })}`,
        `${Constants.DND_STATUS} ${t('commands:guildinfo.dnd', { count: guild.members.filter(m => m.presence.status === 'dnd').size })}`,
        `${Constants.OFFLINE_STATUS} ${t('commands:guildinfo.offline', { count: guild.members.filter(m => m.presence.status === 'offline').size })}\n`,
        t('commands:guildinfo.users', { count: guild.members.filter(m => !m.user.bot).size }),
        t('commands:guildinfo.bots', { count: guild.members.filter(m => m.user.bot).size })
      ].join('\n'))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
