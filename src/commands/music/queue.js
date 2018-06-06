const { Command, CommandRequirements, SwitchbladeEmbed } = require('../../')

const MAX_PLAYLIST_LENGTH = 10

module.exports = class Queue extends Command {
  constructor (client) {
    super(client)
    this.name = 'queue'
    this.aliases = ['playlist']

    this.requirements = new CommandRequirements(this, {guildOnly: true, guildPlaying: true})
  }

  async run (message, args) {
    const guildPlayer = this.client.playerManager.get(message.guild.id)

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

    message.channel.send(new SwitchbladeEmbed(message.author).setDescription(description.join('\n')))
  }
}
