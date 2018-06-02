const { Command, SwitchbladeEmbed, Constants } = require('../../')

const MAX_PLAYLIST_LENGTH = 10

module.exports = class Queue extends Command {
  constructor (client) {
    super(client)
    this.name = 'queue'
    this.aliases = ['playlist']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    const playerManager = this.client.playerManager
    const guildPlayer = playerManager.get(message.guild.id)
    if (guildPlayer && guildPlayer.playing) {
      const npSong = guildPlayer.playingSong
      const description = [`**Now playing:** [${npSong.title}](${npSong.uri})`]

      if (guildPlayer.queue.length > 0) {
        const queue = guildPlayer.queue.map((song, i) => `${i + 1}. [${song.title}](${song.uri}) (added by ${song.requestedBy})`).slice(0, MAX_PLAYLIST_LENGTH)
        description.push('', '**Songs queued:**', ...queue)

        const missing = guildPlayer.queue.length - MAX_PLAYLIST_LENGTH
        if (missing > 0) description.push(`\`and ${missing} more...\``)
      } else {
        description.push('There are no songs after the current one.')
      }

      embed.setDescription(description.join('\n'))
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('I ain\'t playing anything!')
    }

    message.channel.send(embed)
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
