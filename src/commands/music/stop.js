const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super(client)
    this.name = 'stop'
    this.aliases = []
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer.playing) {
        guildPlayer.stop()
        embed
          .setTitle(`${Constants.STOP_BUTTON} All tracks have been stopped!`)
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle('I ain\'t playing anything!')
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('You need to be in a voice channel to use this command.')
    }

    message.channel.send(embed)
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
