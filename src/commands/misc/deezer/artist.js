const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils, CommandStructures } = require('../../../')
const { BooleanFlagParameter, CommandParameters, StringParameter } = CommandStructures

module.exports = class DeezerArtist extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'deezer')

    this.name = 'artist'
    this.aliases = ['ar']
    this.embedColor = Constants.DEEZER_COLOR
    this.embedLogoURL = 'https://i.imgur.com/lKlFtbs.png'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commons:search.noParams' }),
      [
        new BooleanFlagParameter({ name: 'albums', aliases: [ 'a' ] }),
        new BooleanFlagParameter({ name: 'related', aliases: [ 'r' ] })
      ]
    )
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findArtists(query)
    return results.data
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.name}](${item.link}) - ${t('commands:deezer.fansCount', { fans: MiscUtils.formatNumber(item.nb_fan, language) })}`
  }

  async handleResult ({ t, channel, author, language, flags }, artist) {
    const { id, name, link, nb_album: albums, picture_big: cover, nb_fan: fans } = artist
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.artist.artistInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
    if (flags['albums']) {
      const { data } = await this.client.apis.deezer.getArtistAlbums(id)
      const albumList = data.map((album, i) => {
        const explicit = album.explicit_lyrics ? Constants.EXPLICIT : ''
        return `\`${this.formatIndex(i, data)}\`. ${explicit} [${album.title}](${album.link}) \`(${album.release_date.split('-')[0]})\``
      })
      if (albums > 10) albumList.push(t('music:moreAlbums', { albums: albums - 10 }))
      return channel.send(embed
        .setDescription(albumList)
        .setTitle(name)
        .setURL(link)
        .setAuthor(t('commands:deezer.subcommands.artist.artistAlbums'), this.embedLogoURL, link)
      )
    }

    if (flags['related']) {
      const { data } = await this.client.apis.deezer.getArtistRelated(id)
      const artistList = data.slice(0, 10).map((artist, i) => {
        return `\`${this.formatIndex(i, data)}\`. [${artist.name}](${artist.link}) - ${t('commands:deezer.fansCount', { fans: MiscUtils.formatNumber(artist.nb_fan, language) })}`
      })
      if (albums.length > 10) artistList.push(t('music:moreArtists', { artists: data.length - 10 }))
      return channel.send(embed
        .setDescription(artistList)
        .setTitle(name)
        .setURL(link)
        .setAuthor(t('commands:deezer.subcommands.artist.artistRelated'), this.embedLogoURL, link)
      )
    }

    embed.setDescription(`[${name}](${link})`)
      .addField(t('music:albumPlural'), MiscUtils.formatNumber(albums, language), true)
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans, language), true)
    channel.send(embed)
  }
}
