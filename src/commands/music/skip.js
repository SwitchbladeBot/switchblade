const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Skip extends Command {
  constructor (client) {
    super(client)
    this.name = 'next'
    this.aliases = ['skip']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        const song = guildPlayer.playingSong
        message.channel.send(embed
          .setDescription(`${Constants.STOP_BUTTON} [${song.title}](${song.uri}) **was skipped!**`))
        guildPlayer.next()
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
