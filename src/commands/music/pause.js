const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'pause'
    this.aliases = ['resume']
  }

  async run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)

    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        const pause = !guildPlayer.paused
        message.channel.send(embed
          .setTitle(`${pause ? Constants.PAUSE_BUTTON : Constants.PLAY_BUTTON} ${t('music:stateChanged', {context: pause ? 'pause' : 'resume'})}`)
        )
        guildPlayer.pause(pause)
      } else {
        message.channel.send(embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('errors:notPlaying'))
        )
      }
    } else {
      message.channel.send(embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:voiceChannelOnly'))
      )
    }
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
