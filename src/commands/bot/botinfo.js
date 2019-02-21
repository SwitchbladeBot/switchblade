const { Command, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const Discord = require('discord.js')
const moment = require('moment')

module.exports = class BotInfo extends Command {
  constructor (client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bi', 'binfo'],
      category: 'bot'
    })
  }

  run ({ channel, author, t, language }) {
    const uptime = moment.duration(process.uptime() * 1000).format('d[d] h[h] m[m] s[s]')
    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
        .setThumbnail(this.client.user.displayAvatarURL)
        .setDescription([
          t('commands:botinfo.hello', { user: this.client.user }),
          t('commands:botinfo.statistics', { guilds: MiscUtils.formatNumber(this.client.guilds.size, language), commands: MiscUtils.formatNumber(this.client.commands.length, language), uptime, Discord, nodeVersion: process.version, users: MiscUtils.formatNumber(this.client.users.filter(u => !u.bot).size, language) })
        ].join('\n\n'))
        .addField(t('commands:botinfo.links'), [
          t('commands:botinfo.inviteLink', { Constants }),
          t('commands:botinfo.supportServer', { Constants }),
          t('commands:botinfo.website', { Constants }),
          t('commands:botinfo.translate', { Constants }),
          t('commands:botinfo.github', { Constants }),
          t('commands:botinfo.patreon', { Constants })
        ].join('\n'))
    )
  }
}
