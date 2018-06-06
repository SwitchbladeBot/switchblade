const { Command, CommandRequirements, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'pause'
    this.aliases = ['resume']

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true})
  }

  async run (message, args) {
    const guildPlayer = this.client.playerManager.get(message.guild.id)
    const pause = !guildPlayer.paused
    message.channel.send(new SwitchbladeEmbed(message.author)
      .setTitle(`${pause ? Constants.PAUSE_BUTTON : Constants.PLAY_BUTTON} Music player has been ${pause ? 'paused' : 'resumed'}!`))
    guildPlayer.pause(pause)
  }
}
