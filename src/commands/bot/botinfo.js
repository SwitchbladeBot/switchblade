const { Command, SwitchbladeEmbed, MiscUtils } = require('../../')
const Discord = require('discord.js')
const moment = require('moment')

module.exports = class BotInfo extends Command {
  constructor (client) {
    super({
      name: 'botinfo',
      aliases: ['bi', 'binfo'],
      category: 'bot'
    }, client)
  }

  async run ({ channel, author, t, language }) {
    const uptime = moment.duration(process.uptime() * 1000).format('d[d] h[h] m[m] s[s]')
    const shardGuildCounts = await this.client.shard.fetchClientValues('guilds.cache.size')
    const totalGuildCount = shardGuildCounts.reduce((total, current) => total + current)
    const shardUserCounts = await this.client.shard.fetchClientValues('users.cache.size')
    const totalUserCount = shardUserCounts.reduce((total, current) => total + current)
    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setThumbnail(this.client.user.displayAvatarURL({ format: 'png' }))
        .setFooter(`Shard ${this.client.shard.ids.toString()}`)
        .setDescription([
          t('commands:botinfo.hello', { user: this.client.user }),
          t('commands:botinfo.statistics', { guilds: MiscUtils.formatNumber(totalGuildCount, language), commands: MiscUtils.formatNumber(this.client.commands.length, language), uptime, Discord, nodeVersion: process.version, users: MiscUtils.formatNumber(totalUserCount, language) })
        ].join('\n\n'))
        .addField(t('commands:botinfo.links'), [
          t('commands:botinfo.inviteLink', { botBadge: this.getEmoji('botBadge') }),
          t('commands:botinfo.supportServer', { discordLogo: this.getEmoji('discordLogo') }),
          t('commands:botinfo.website', { switchbladeLogo: this.getEmoji('switchblade') }),
          t('commands:botinfo.translate', { crowdinLogo: this.getEmoji('crowdinLogo') }),
          t('commands:botinfo.github', { githubLogo: this.getEmoji('githubLogo') }),
          t('commands:botinfo.openCollective', { openCollectiveLogo: this.getEmoji('openCollectiveLogo') })
        ].join('\n'))
    )
  }
}
