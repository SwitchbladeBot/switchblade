const { Command, CommandRequirements, SwitchbladeEmbed } = require('../../')

const MAX_PLAYLIST_LENGTH = 10

module.exports = class Queue extends Command {
  constructor (client) {
    super(client)
    this.name = 'queue'
    this.aliases = ['playlist']
    this.category = 'music'

    this.requirements = new CommandRequirements(this, { guildOnly: true, guildPlaying: true })
  }

  async run ({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    const embed = new SwitchbladeEmbed(author)

    const npSong = guildPlayer.playingSong
    const description = [`**${t('music:nowPlaying')}** [${npSong.title}](${npSong.uri})`]

    if (guildPlayer.queue.length > 0) {
      const queue = guildPlayer.queue.map((song, i) => `${i + 1}. [${song.title}](${song.uri}) *(${t('music:addedBy', { user: song.requestedBy })})*`).slice(0, MAX_PLAYLIST_LENGTH)
      description.push('', `**${t('music:queue')}:**`, ...queue)

      const missing = guildPlayer.queue.length - MAX_PLAYLIST_LENGTH
      if (missing > 0) description.push(`\`${t('music:andMore', { missing })}\``)
    } else {
      description.push(t('music:noneAfterCurrent'))
    }

    channel.send(embed.setDescription(description.join('\n')))
  }
}
