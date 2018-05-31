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
        embed.setDescription(`${Constants.STOP_BUTTON} [${song.info.title}](${song.info.uri}) **was skipped!**`)
        guildPlayer.next()
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
