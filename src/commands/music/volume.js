const { Command, SwitchbladeEmbed } = require('../../')

const MAX_VOLUME = 150

module.exports = class Volume extends Command {
  constructor (client) {
    super(client, {
      name: 'volume',
      aliases: ['vol'],
      category: 'music',
      requirements: {
        guildOnly: true,
        sameVoiceChannelOnly: true,
        guildPlaying: true,
        errors: {
          guildPlaying: 'commands:volume.notPlaying'
        }
      },
      parameters: [{
        type: 'number',
        full: true,
        min: 0,
        max: MAX_VOLUME,
        forceMin: true,
        forceMax: true,
        missingError: 'commands:volume.missingVolumeParameter'
      }]
    })
  }

  async run ({ t, author, channel, guild }, volume) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)

    if (volume === MAX_VOLUME) embed.setImage('https://i.imgur.com/A6HWTqq.png')
    else if (guildPlayer.bassboosted) guildPlayer.bassboost(false)

    guildPlayer.volume(volume)

    channel.send(embed.setTitle(`\uD83D\uDD0A ${t('commands:volume.volumeSet', { volume })}`))
  }
}
