const { Command, SwitchbladeEmbed } = require('../../../')

const MAX_PLAYLIST_LENGTH = 10

module.exports = class Queue extends Command {
  constructor (client) {
    super({
      name: 'queue',
      aliases: ['playlist'],
      category: 'music',
      requirements: { guildOnly: true, guildPlaying: true }
    }, client)
  }

  async run ({ t, aliase, author, channel, guild, prefix }) {
    const { playingSong, queue } = this.client.playerManager.players.get(guild.id)
    const embed = new SwitchbladeEmbed(author)

    const npSong = playingSong
    const description = [`**${t('music:nowPlaying')}** [${npSong.title}](${npSong.uri})`]

    if (queue.length > 0) {
      const queueParsed = queue.slice(0, MAX_PLAYLIST_LENGTH).map((song, i) => `${i + 1}. [${song.title}](${song.uri}) *(${t('music:addedBy', { user: song.requestedBy })})*`)
      description.push('', `**${t('music:queue')}:**`, ...queueParsed)

      const missing = queue.length - MAX_PLAYLIST_LENGTH
      if (missing > 0) description.push(`\`${t('music:andMore', { missing })}\``)

      description.push('', t('commands:queue.clearAdvice', { usage: `${prefix}${aliase} clear` }))
    } else {
      description.push(t('music:noneAfterCurrent'))
    }

    channel.send(embed.setDescription(description.join('\n')))
  }
}
