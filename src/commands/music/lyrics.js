const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Lyrics extends Command {
  constructor (client) {
    super(client)
    this.name = 'lyrics'
    this.aliases = ['lyric', 'genius']
    this.category = 'music'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:lyrics.noTrackName' })
    )
  }

  canLoad () {
    return !!this.client.apis.genius
  }

  async run ({ t, author, channel }, song) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const request = await this.client.apis.genius.findTrack(song)
    const data = request.response.hits[0]
    if (data) {
      const img = data.result.song_art_image_thumbnail_url
      const extendedsong = data.result.title_with_featured
      const artist = data.result.primary_artist.name
      const body = await this.client.apis.genius.loadLyrics(data.result.url)

      embed.setAuthor('Genius', 'https://i.imgur.com/NmCTsoF.png')
        .setDescription(body.length >= 1900 ? `${body.substr(0, 1900)}\n\n[${t('commands:lyrics.fullLyrics')}](http://genius.com${data.result.path})` : body)
        .setThumbnail(img)
        .setColor(Constants.GENIUS_COLOR)
        .setTitle(`${extendedsong} - ${artist}`)
        .setURL(`http://genius.com${data.result.path}`)
      return channel.send(embed).then(() => channel.stopTyping())
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:lyrics.noLyricsFound'))
      channel.send(embed).then(() => channel.stopTyping())
    }
  }
}
