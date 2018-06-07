const { Command, SwitchbladeEmbed, Constants } = require('../../')

const MAX_PLAYLIST_LENGTH = 10

module.exports = class Queue extends Command {
  constructor (client) {
    super(client)
    this.name = 'queue'
    this.aliases = ['playlist']
  }

  async run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)

    const playerManager = this.client.playerManager
    const guildPlayer = playerManager.get(message.guild.id)
    if (guildPlayer && guildPlayer.playing) {
      const npSong = guildPlayer.playingSong
      const description = [`**${t('music:nowPlaying')}:** [${npSong.title}](${npSong.uri})`]

      if (guildPlayer.queue.length > 0) {
        const queue = guildPlayer.queue.map((song, i) => `${i + 1}. [${song.title}](${song.uri}) *(${t('music:addedBy', {user: song.requestedBy})})*`).slice(0, MAX_PLAYLIST_LENGTH)
        description.push('', `**${t('music:queue')}:**`, ...queue)

        const missing = guildPlayer.queue.length - MAX_PLAYLIST_LENGTH
        if (missing > 0) description.push(`\`${t('music:andMore', {missing})}\``)
      } else {
        description.push(t('music:noneAfterCurrent'))
      }

      embed.setDescription(description.join('\n'))
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(rt('errors:notPlaying'))
    }

    message.channel.send(embed)
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
