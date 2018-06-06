const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'pause'
    this.aliases = ['resume']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        const pause = !guildPlayer.paused
        message.channel.send(embed
          .setTitle(`${pause ? Constants.PAUSE_BUTTON : Constants.PLAY_BUTTON} Music player has been ${pause ? 'paused' : 'resumed'}!`))
        guildPlayer.pause(pause)
      } else {
        message.channel.send(embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle('I ain\'t playing anything!'))
      }
    } else {
      message.channel.send(embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('You need to be in a voice channel to use this command!'))
    }
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
