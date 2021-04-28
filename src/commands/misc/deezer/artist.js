const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerArtist extends SearchCommand {
  constructor (client) {
    super({
      name: 'artist',
      aliases: ['ar'],
      parent: 'deezer',
      embedColor: Constants.DEEZER_COLOR,
      embedLogoURL: 'https://i.imgur.com/lKlFtbs.png',
      parameters: [{
        type: 'string', full: true, missingError: 'commons:search.noParams'
      }, [{
        type: 'booleanFlag', name: 'albums', aliases: ['a']
      }, {
        type: 'booleanFlag', name: 'related', aliases: ['r']
      }]]
    }, client)
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findArtists(query)
    return results.data
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.name}](${item.link}) - ${t('commands:deezer.fansCount', { fans: MiscUtils.formatNumber(item.nb_fan, language) })}`
  }

  async handleResult ({ t, channel, author, language, flags }, artist) {
    channel.startTyping()
    const { id, name, link, nb_album: albums, picture_big: cover, nb_fan: fans } = artist
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.artist.artistInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
    if (flags.albums) {
      const { data } = await this.client.apis.deezer.getArtistAlbums(id)
      const albumList = data.map((album, i) => {
        const explicit = album.explicit_lyrics ? this.getEmoji('explicit') : ''
        return `\`${this.formatIndex(i, data)}\`. ${explicit} [${album.title}](${album.link}) \`(${album.release_date.split('-')[0]})\``
      })
      if (albums > 10) albumList.push(t('music:moreAlbums', { albums: albums - 10 }))
      return channel.send(embed
        .setDescription(albumList)
        .setTitle(name)
        .setURL(link)
        .setAuthor(t('commands:deezer.subcommands.artist.artistAlbums'), this.embedLogoURL, link)
      ).then(() => channel.stopTyping())
    }

    if (flags.related) {
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
      ).then(() => channel.stopTyping())
    }

    embed.setDescription(`[${name}](${link})`)
      .addField(t('music:albumPlural'), MiscUtils.formatNumber(albums, language), true)
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans, language), true)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
