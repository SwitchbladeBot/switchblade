const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Queue extends Command {
  constructor (client) {
    super(client)
    this.name = 'queue'
    this.aliases = ['playlist']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        const npSong = guildPlayer.playingSong
        const description = [`**Now playing:** [${npSong.info.title}](${npSong.info.uri})`]

        if (guildPlayer.queue.length > 0) {
          description.push('', '**Songs queued:**')
          description.push(...guildPlayer.queue.map((song, i) => `${i + 1}. [${song.info.title}](${song.info.uri}) (added by ${song.author})`))
        } else {
          description.push('There are no songs after the current one.')
        }

        embed.setDescription(description.join('\n'))
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
