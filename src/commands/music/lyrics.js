const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const lyrics = require('../../utils/LyricsUtils.js')

module.exports = class Lyrics extends Command {
  constructor (client) {
    super(client)
    this.name = 'lyrics'
    this.aliases = ['lyric', 'genius']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:lyrics.noTrackName'})
    )
  }

  async run ({ t, author, channel }, song) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const request = await lyrics.getLyrics(`search?q=${song}`)
    const data = request.response.hits[0]
    if (!data) {
      embed.setColor(Constants.ERROR_COLOR).setTitle(t('commands:lyrics.noLyricsFound'))
      return channel.send(embed).then(() => channel.stopTyping())
    }

    const img = data.result.song_art_image_thumbnail_url
    const extendedsong = data.result.title_with_featured
    const artist = data.result.primary_artist.name
    const body = await lyrics.loadLyrics(data.result.url)
    if (!body) {
      embed.setColor(Constants.ERROR_COLOR).setTitle(t('commands:lyrics.noLyricsFound'))
      return channel.send(embed).then(() => channel.stopTyping())
    }

    embed.setAuthor(`Genius`, 'https://cdn.discordapp.com/attachments/445647209892020234/467733917798236202/b7b6ada09725d7a97a01bbef815b74d2.png')
      .setDescription(body.length >= 1900 ? `${body.substr(0, 1900)}\n\n[Click here to see the full lyrics](http://genius.com${data.result.path})` : body)
      .setThumbnail(img)
      .setColor('#FFFB66')
      .setTitle(`${extendedsong} - ${artist}`)
      .setURL(`http://genius.com${data.result.path}`)
    return channel.send(embed).then(() => channel.stopTyping())
  }
}
