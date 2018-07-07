const { Command, SwitchbladeEmbed, Constants } = require('../../')
const Discord = require('discord.js')
const moment = require('moment')

module.exports = class BotInfo extends Command {
  constructor (client) {
    super(client)
    this.name = 'botinfo'
    this.aliases = ['bi', 'binfo']
  }

  run ({ channel, author, t }) {
    const embed = new SwitchbladeEmbed(author)
    const uptime = moment.duration(process.uptime() * 1000).format('d[d] h[h] m[m] s[s]')
    channel.startTyping()

    embed.setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
      .setThumbnail(this.client.user.displayAvatarURL)
      .setDescription([
        t('commands:botinfo.hello', { this: this }),
        t('commands:botinfo.statistics', { this: this, uptime, Discord, process })
      ].join('\n\n'))
      .addField(t('commands:botinfo.links'), [
        t('commands:botinfo.inviteLink', { Constants }),
        t('commands:botinfo.supportServer', { Constants }),
        t('commands:botinfo.translate', { Constants }),
        t('commands:botinfo.github', { Constants })
      ].join('\n'))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
