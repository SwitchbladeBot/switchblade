const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Volume extends Command {
  constructor (client) {
    super(client)
    this.name = 'volume'
    this.aliases = ['vol']
  }

  async run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)

    if (args.length > 0) {
      if (message.member.voiceChannel) {
        const playerManager = this.client.playerManager
        const guildPlayer = playerManager.get(message.guild.id)
        if (guildPlayer && guildPlayer.playing) {
          const volume = Math.max(Math.min(parseInt(args[0]), 150), 0)
          if (!isNaN(volume)) {
            guildPlayer.volume(volume)
            embed
              .setTitle(`\uD83D\uDD0A ${t('commands:volume.volumeSet', {volume})}`)
          } else {
            embed
              .setColor(Constants.ERROR_COLOR)
              .setTitle(t('commands:volume.invalidVolumeParameter'))
          }
        } else {
          embed
            .setColor(Constants.ERROR_COLOR)
            .setTitle(t('errors:notPlaying'))
        }
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('errors:voiceChannelOnly'))
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:volume.missingVolumeParameter'))
        .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:volume.commandUsage')}`)
    }

    message.channel.send(embed)
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
