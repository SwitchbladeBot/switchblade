const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Lyrics extends Command {
  constructor (client) {
    super(client, {
      name: 'lyrics',
      aliases: ['lyric', 'genius'],
      category: 'music',
      requirements: { apis: ['genius'] },
      parameters: [{
        type: 'string', full: true, required: false
      }]
    })
  }

  async run ({ t, author, channel, guild }, song) {
    channel.startTyping()

    const playingSong = !song
    if (playingSong) {
      const guildPlayer = (guild && this.client.playerManager && this.client.playerManager.get(guild.id))
      if (!guildPlayer || !guildPlayer.playing) {
        throw new CommandError(t('commands:lyrics.noTrackName'), true)
      }

      song = guildPlayer.playingSong.title
    }

    const embed = new SwitchbladeEmbed(author)
    const { response: { hits: [ hit ] } } = await this.client.apis.genius.findTrack(song)
    if (hit) {
      const { result: {
        song_art_image_thumbnail_url: thumbnailUrl,
        title_with_featured: title,
        primary_artist: { name: artist },
        url,
        path
      } } = hit
      const body = await this.client.apis.genius.loadLyrics(url)

      embed.setAuthor('Genius', 'https://i.imgur.com/NmCTsoF.png')
        .setDescription(body.length >= 1900 ? `${body.substr(0, 1900)}\n\n[${t('commands:lyrics.fullLyrics')}](http://genius.com${path})` : body)
        .setThumbnail(thumbnailUrl)
        .setColor(Constants.GENIUS_COLOR)
        .setTitle(`${title} - ${artist}`)
        .setURL(`http://genius.com${path}`)
      return channel.send(embed).then(() => channel.stopTyping())
    } else {
      const error = playingSong ? 'noLyricsFoundPlaying' : 'noLyricsFound'
      throw new CommandError(t(`commands:lyrics.${error}`))
    }
  }
}
