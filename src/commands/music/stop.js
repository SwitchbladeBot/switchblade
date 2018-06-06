const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super(client)
    this.name = 'stop'
    this.aliases = []
  }

  async run (message, args) {
    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        guildPlayer.stop(message.author)
      } else {
        message.channel.send(
          new SwitchbladeEmbed(message.author)
            .setColor(Constants.ERROR_COLOR)
            .setTitle('I ain\'t playing anything!')
        )
      }
    } else {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setColor(Constants.ERROR_COLOR)
          .setTitle('You need to be in a voice channel to use this command!')
      )
    }
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
