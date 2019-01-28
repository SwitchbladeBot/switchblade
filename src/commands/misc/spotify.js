const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const { Command, CommandError, CommandParameters, StringParameter, CommandRequirements } = CommandStructures
const moment = require('moment')

const SPOTIFY_LOGO = 'https://i.imgur.com/vw8svty.png'

const types = [['track', 'song', 't', 's'], ['album', 'al'], ['artist', 'ar'], ['playlist', 'p'], ['user', 'u']]

class Spotify extends Command {
  constructor (client) {
    super(client)

    this.name = 'spotify'
    this.aliases = ['sp']
    this.requirements = new CommandRequirements(this, { apis: ['spotify'] })
    this.subcommands = [
      new SpotifyTrack(client, this),
      new SpotifyAlbum(client, this),
      new SpotifyArtist(client, this),
      new SpotifyPlaylist(client, this),
      new SpotifyUser(client, this)]
    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whitelist: types.reduce((a, v) => a.concat(v), []),
        required: true,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:spotify.noType'))
            .setDescription([
              `**${t('commons:usage')}:** \`${prefix}${this.name} ${t('commands:spotify.commandUsage')}\``,
              '',
              `__**${t('commands:spotify.types')}:**__`,
              `**${types.map(l => `\`${l[0]}\``).join(', ')}**`
            ].join('\n'))
        }
      })
    )
  }

  static formatIndex (index) {
    return index.toString().padStart(2, '0')
  }

  static formatDuration (duration) {
    return moment.duration(duration).format('mm:ss')
  }

  static verifyCollected (selected, length) {
    const number = Number(selected)
    if (isNaN(number)) return false
    if (number < 1) return false
    return number <= length
  }

  async searchHandler (query, type, prefix) {
    if (!prefix) prefix = (obj, i) => `\`${Spotify.formatIndex(++i)}\`. [${obj.name}](${obj.external_urls.spotify}) - [${obj.artists[0].name}](${obj.artists[0].external_urls.spotify})`

    const method = type === 'album' ? 'searchAlbums' : type === 'track' ? 'searchTracks' : type === 'artist' ? 'searchArtists' : 'searchPlaylists'
    const results = await this.client.apis.spotify[method](query, 10)
    return results ? { description: results.map(prefix), ids: results.map(r => r.id) } : false
  }

  async awaitResponseMessage (message, ids, callback) {
    const filter = c => c.author.equals(message.author) && Spotify.verifyCollected(c.content, ids.length)

    message.channel.awaitMessages(filter, { time: 10000, max: 1 })
      .then(collected => {
        if (collected.size > 0) callback(ids[Number(collected.first().content) - 1])
      })
  }
}

module.exports = Spotify

class SpotifyTrack extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = types[0][0]
    this.aliases = types[0].slice(1)
    this.parentCommand = parentCommand

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.track.noTrack' })
    )
  }

  async run ({ t, author, channel, message }, query) {
    channel.startTyping()

    const results = await this.parentCommand.searchHandler(query, 'track')
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.track.notFound', { query }))

    const { description, ids } = results

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.track.results', { query }), SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getTrack(t, id, channel, author))
  }

  async getTrack (t, id, channel, author) {
    const { album, artists, name, duration_ms: duration, explicit, external_urls: urls } = await this.client.apis.spotify.getTrack(id)
    const [ cover ] = album.images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify.artistPlural') : t('commands:spotify.artist')
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.track.trackInfo'), SPOTIFY_LOGO, urls.spotify)
      .setDescription(`${explicit ? `${Constants.EXPLICIT} ` : ' '}[${name}](${urls.spotify}) \`(${Spotify.formatDuration(duration)})\``)
      .setThumbnail(cover.url)
      .addField(t('commands:spotify.album'), `[${album.name}](${album.external_urls.spotify}) \`(${album.release_date.split('-')[0]})\``, true)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    channel.send(embed)
  }
}

class SpotifyAlbum extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = types[1][0]
    this.aliases = types[1].slice(1)
    this.parentCommand = parentCommand

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.album.noAlbum' })
    )
  }

  async run ({ t, author, channel, message }, query) {
    channel.startTyping()

    const results = await this.parentCommand.searchHandler(query, 'album')
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.album.notFound', { query }))

    const { description, ids } = results

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.album.results', { query }), SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getAlbum(t, id, channel, author))
  }

  async getAlbum (t, id, channel, author) {
    const { album_type: type, artists, name, release_date: release, total_tracks: total, tracks, images, external_urls: urls } = await this.client.apis.spotify.getAlbum(id)
    const [ cover ] = images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify.artistPlural') : t('commands:spotify.artist')
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.album.albumInfo'), SPOTIFY_LOGO, urls.spotify)
      .setDescription(`[${name}](${urls.spotify}) \`(${release.split('-')[0]})\``)
      .setThumbnail(cover.url)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    if (type !== 'album') embed.addField(t('commands:spotify.subcommands.album.albumType'), t(`commands:spotify.subcommands.album.types.${type}`), true)

    const trackMapper = (track, i) => `\`${i + 1}.\` ${track.explicit ? Constants.EXPLICIT : ''} [${track.name}](${track.external_urls.spotify}) \`(${Spotify.formatDuration(track.duration_ms)})\``
    const trackList = tracks.items.map(trackMapper).slice(0, 5)

    if (total > 5) trackList.push(t('commands:spotify.moreTracks', { tracks: total - 5 }))

    embed.addField(total > 1 ? `${t('commands:spotify.trackPlural')} (${total})` : `${t('commands:spotify.track')}`, trackList)
    channel.send(embed)
  }
}

class SpotifyArtist extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = types[2][0]
    this.aliases = types[2].slice(1)
    this.parentCommand = parentCommand

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.artist.noArtist' })
    )
  }

  async run ({ t, author, channel, message, language }, query) {
    channel.startTyping()

    const prefix = (obj, i) => `\`${Spotify.formatIndex(++i)}\`. [${obj.name}](${obj.external_urls.spotify}) - ${t('commands:spotify.followersCount', { followers: MiscUtils.formatNumber(obj.followers.total, language) })}`
    const results = await this.parentCommand.searchHandler(query, 'artist', prefix)
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.artist.notFound', { query }))

    const { description, ids } = results

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.artist.results', { query }), SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getArtist(t, id, channel, author, language))
  }

  async getArtist (t, id, channel, author, language) {
    const { name, genres, followers, images, external_urls: urls } = await this.client.apis.spotify.getArtist(id)
    const [ cover ] = images.sort((a, b) => b.width - a.width)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.artist.artistInfo'), SPOTIFY_LOGO, urls.spotify)
      .setDescription(`[${name}](${urls.spotify})`)
      .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

    const { items: albums, total } = await this.client.apis.spotify.getArtistAlbums(id, 5)
    const albumList = albums.map((album, i) => `\`${++i}.\` [${album.name}](${album.external_urls.spotify}) \`(${album.release_date.split('-')[0]})\``)

    if (cover) embed.setThumbnail(cover.url)
    if (total > 5) albumList.push(t('commands:spotify.moreAlbums', { albums: total - 5 }))
    if (genres.length) embed.addField(t('commands:spotify.genres'), `\`${genres.join('`, `')}\``, true)

    if (albums.length) embed.addField(`${t('commands:spotify.albumPlural')} (${total})`, albumList)
    channel.send(embed)
  }
}

class SpotifyPlaylist extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = types[3][0]
    this.aliases = types[3].slice(1)
    this.parentCommand = parentCommand

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.playlist.noPlaylist' })
    )
  }

  async run ({ t, author, channel, message, language }, query) {
    channel.startTyping()

    const prefix = (obj, i) => `\`${Spotify.formatIndex(++i)}\`. [${obj.name}](${obj.external_urls.spotify}) - [${obj.owner.display_name}](${obj.owner.external_urls.spotify})`
    const results = await this.parentCommand.searchHandler(query, 'playlist', prefix)
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.playlist.notFound', { query }))

    const { description, ids } = results

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.playlist.results', { query }), SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getPlaylist(t, id, channel, author, language))
  }

  async getPlaylist (t, id, channel, author, language) {
    const { name, description, external_urls: urls, followers, images, owner, tracks } = await this.client.apis.spotify.getPlaylist(id)
    const [ cover ] = images.sort((a, b) => b.width - a.width)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.playlist.playlistInfo'), SPOTIFY_LOGO, urls.spotify)
      .setTitle(name)
      .setURL(urls.spotify)
      .setDescription(description)
      .setThumbnail(cover.url)
      .addField(t('commands:spotify.subcommands.playlist.createdBy'), `[${owner.display_name}](${owner.external_urls.spotify})`, true)
      .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

    const trackList = tracks.items.slice(0, 5).map(t => t.track).map((track, i) => `\`${i + 1}.\` ${track.explicit ? Constants.EXPLICIT : ''} [${track.name}](${track.external_urls.spotify}) - [${track.artists[0].name}](${track.artists[0].external_urls.spotify})`)
    const total = tracks.total

    if (total > 5) trackList.push(t('commands:spotify.moreTracks', { tracks: total - 5 }))
    embed.addField(`${t('commands:spotify.trackPlural')} (${total})`, trackList)
    channel.send(embed)
  }
}

class SpotifyUser extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = types[4][0]
    this.aliases = types[4].slice(1)
    this.parentCommand = parentCommand

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.user.noUser' })
    )
  }

  async run ({ t, author, channel, language }, user) {
    if (!await this.getUser(t, author, channel, language, user)) throw new CommandError(t('commands:spotify.subcommands.user.notFound', { user }))
  }

  async getUser (t, author, channel, language, user) {
    try {
      const { display_name: name, images, followers, external_urls: urls } = await this.client.apis.spotify.getUser(user)
      const [image] = images.sort((a, b) => b.width - a.width)
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.SPOTIFY_COLOR)
        .setAuthor(t('commands:spotify.subcommands.user.userInfo'), SPOTIFY_LOGO, urls.spotify)
        .setDescription(name || user)
        .setThumbnail(image.url)
        .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

      await channel.send(embed)
      return true
    } catch (e) {
      return false
    }
  }
}
