const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter, CommandError } = CommandStructures
const moment = require('moment')
const Intl = require('intl')

Intl.__disableRegExpRestore()

// Formatting index for lists
const formatIndex = index => index.toString().padStart(2, '0')

// Formatting url for embeds
const formatUrl = name => name.replace(/\)/g, '%29').replace(/\(/g, '%28').replace(/_/g, '%25')

// Regex to change the Read More from last.fm bio
const READ_MORE_REGEX = /<a href="(https?:\/\/www.last.fm\/music\/[-a-zA-Z0-9@:%_+.~#?&/=]*)">Read more on Last.fm<\/a>/g

const awaitQuerySelect = (channel, filter, callback) => {
  channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
    .then(collected => {
      if (collected.size > 0) callback(Number(collected.first().content))
    })
    .catch(() => false)
}

const verifySelectFilter = (select, length) => {
  const number = Number(select)
  if (isNaN(number)) return false
  if (number < 1) return false
  return number <= length
}

const subCommands = ['track', 'artist', 'album', 'user']

module.exports = class LastFM extends Command {
  constructor (client) {
    super(client)
    this.name = 'lastfm'
    this.aliases = ['lfm']
    this.subcommands = [new LastfmTrack(client, this), new LastfmArtist(client, this), new LastfmAlbum(client, this), new LastfmUser(client, this)]

    this.requirements = new CommandRequirements(this, { apis: ['lastfm'] })
  }

  run ({ t, author, prefix, alias, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription(subCommands.map(cmd => {
      return `${t(`commands:lastfm.subcommands.${cmd}.commandDescription`)} \`${prefix}${alias || this.name} ${cmd} ${t(`commands:lastfm.subcommands.${cmd}.commandUsage`)} \``
    }).join('\n'))
    channel.send(embed)
  }
}

class LastfmTrack extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'track'
    this.aliases = ['t']

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        missingError: 'commands:lastfm.subcommands.track.missing'
      })
    )
  }

  async run ({ t, author, channel, language }, query) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const { results } = await this.client.apis.lastfm.searchTrack(query, 10)
    const tracks = results.trackmatches.track

    if (tracks.length < 1) throw new CommandError(t('commands:lastfm.notFound', { query }))

    embed.setColor(Constants.LASTFM_COLOR)
      .setAuthor(t('commands:lastfm.subcommands.track.results', { query }), 'https://i.imgur.com/TppYCun.png')
      .setTitle(t('commands:lastfm.subcommands.track.resultsCount', { count: results['opensearch:totalResults'] }))
    const resultList = tracks.map((track, i) => `\`${formatIndex(++i)}\`. [${track.name}](${formatUrl(track.url)}) - ${track.artist}`)

    resultList.push(`\n\n${t('commands:lastfm.selectQuery')}`)
    embed.setDescription(resultList)

    channel.send(embed).then(() => {
      channel.stopTyping()
      const filter = c => c.author.id === author.id && verifySelectFilter(c.content, tracks.length)
      awaitQuerySelect(channel, filter, index => {
        this.sendTrack(t, channel, author, tracks[--index], language)
      })
    })
  }

  async sendTrack (t, channel, author, trackInfo, language) {
    const formatter = new Intl.NumberFormat(language)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.LASTFM_COLOR)
      .setAuthor(trackInfo.artist, 'https://i.imgur.com/TppYCun.png', `https://www.last.fm/music/${encodeURI(trackInfo.artist)}`)
      .setTitle(trackInfo.name)
      .setURL(trackInfo.url)
      .addField(t('commands:lastfm.listeners'), formatter.format(trackInfo.listeners), true)
      .setThumbnail(trackInfo.image[3]['#text'])

    try {
      let { track } = await this.client.apis.lastfm.getTrackInfo(trackInfo.name, trackInfo.artist, language.split('-')[0])

      embed.addField(t('commands:lastfm.playcount'), formatter.format(track.playcount), true)

      if (track.album) {
        embed.addField(t('commands:lastfm.album'), `[${track.album.title}](${track.album.url})`, true)
      }
      if (track.artist) {
        embed.addField(t('commands:lastfm.artist'), `[${track.artist.name}](${track.artist.url})`, true)
      }
      embed.addField(t('commands:lastfm.tags'), track.toptags.tag.map(t => `[${t.name}](${t.url})`).join(', '))
      if (track.wiki) {
        let regex = READ_MORE_REGEX.exec(track.wiki.summary)
        embed.setDescription(`${track.wiki.summary.replace(READ_MORE_REGEX, '')} [${t('commands:lastfm.readMore')}](${regex[1]})`)
      }
    } catch (e) {
    }

    channel.send(embed)
  }
}

class LastfmArtist extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'artist'
    this.aliases = ['ar']

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        missingError: 'commands:lastfm.subcommands.artist.missing'
      })
    )
  }

  async run ({ t, author, channel, language }, query) {
    const embed = new SwitchbladeEmbed(author)
    const { results } = await this.client.apis.lastfm.searchArtist(query, 10)
    const artists = results.artistmatches.artist

    if (artists.length < 1) throw new CommandError(t('commands:lastfm.notFound', { query }))

    embed.setColor(Constants.LASTFM_COLOR)
    embed.setAuthor(t('commands:lastfm.subcommands.artist.results', { query }), 'https://i.imgur.com/TppYCun.png')
    embed.setTitle(t('commands:lastfm.subcommands.artist.resultsCount', { results: results['opensearch:totalResults'] }))
    const resultList = artists.map((artist, i) => `\`${formatIndex(i + 1)}\`. [${artist.name}](${formatUrl(artist.url)})`)

    resultList.push(`\n\n${t('commands:lastfm.selectQuery')}`)
    embed.setDescription(resultList)

    channel.send(embed).then(() => {
      const filter = c => c.author.id === author.id && verifySelectFilter(c.content, artists.length)
      awaitQuerySelect(channel, filter, index => {
        this.sendArtist(t, channel, author, language, artists[--index])
      })
    })
  }

  async sendArtist (t, channel, author, language, artistInfo) {
    const formatter = new Intl.NumberFormat(language)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.LASTFM_COLOR)
      .setAuthor(artistInfo.name, 'https://i.imgur.com/TppYCun.png', artistInfo.url)
      .addField(t('commands:lastfm.listeners'), formatter.format(artistInfo.listeners), true)
      .setThumbnail(artistInfo.image[3]['#text'])

    try {
      let { artist } = await this.client.apis.lastfm.getArtistInfo(artistInfo.name, language.split('-')[0])

      embed.addField(t('commands:lastfm.playcount'), formatter.format(artist.stats.playcount), true)
        .addField(t('commands:lastfm.tags'), artist.tags.tag.map(t => `[${t.name}](${t.url})`).join(', '))
      if (artist.bio.summary) {
        let regex = READ_MORE_REGEX.exec(artist.bio.summary)
        embed.setDescription(`${artist.bio.summary.replace(READ_MORE_REGEX, '')} [${t('commands:lastfm.readMore')}](${regex[1]})`)
      }
    } catch (e) {
    }

    channel.send(embed)
  }
}

class LastfmAlbum extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'album'
    this.aliases = ['al']

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        missingError: 'commands:lastfm.subcommands.album.missing'
      })
    )
  }

  async run ({ t, author, channel, language }, query) {
    const embed = new SwitchbladeEmbed(author)
    const { results } = await this.client.apis.lastfm.searchAlbum(query, 10)
    const albums = results.albummatches.album

    if (albums.length < 1) throw new CommandError(t('commands:lastfm.notFound', { query }))

    embed.setColor(Constants.LASTFM_COLOR)
      .setAuthor(t('commands:lastfm.subcommands.album.results', { query }), 'https://i.imgur.com/TppYCun.png')
      .setTitle(t('commands:lastfm.subcommands.album.resultsCount', { count: results['opensearch:totalResults'] }))
    const resultList = albums.map((album, i) => `\`${formatIndex(i + 1)}\`. [${album.name}](${formatUrl(album.url)}) - ${album.artist}`)

    resultList.push(`\n\n${t('commands:lastfm.selectQuery')}`)
    embed.setDescription(resultList)

    channel.send(embed).then(() => {
      const filter = c => c.author.id === author.id && verifySelectFilter(c.content, albums.length)
      awaitQuerySelect(channel, filter, index => {
        this.sendAlbum(t, channel, author, language, albums[--index])
      })
    })
  }

  async sendAlbum (t, channel, author, language, albumInfo) {
    const formatter = new Intl.NumberFormat(language)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.LASTFM_COLOR)
      .setAuthor(albumInfo.artist, 'https://i.imgur.com/TppYCun.png', `https://www.last.fm/music/${encodeURI(albumInfo.artist)}`)
      .setTitle(albumInfo.name)
      .setURL(albumInfo.url)
      .setThumbnail(albumInfo.image[3]['#text'])

    try {
      let { album } = await this.client.apis.lastfm.getAlbumInfo(albumInfo.name, albumInfo.artist, language.split('-')[0])

      embed.addField(t('commands:lastfm.playcount'), formatter.format(album.playcount), true)
        .addField(t('commands:lastfm.listeners'), formatter.format(album.listeners), true)
      if (album.tags.tag.length > 1) embed.addField(t('commands:lastfm.tags'), album.tags.tag.map(t => `[${t.name}](${t.url})`).join(', '))
      if (album.wiki) {
        let regex = READ_MORE_REGEX.exec(album.wiki.summary)
        embed.setDescription(`${album.wiki.summary.replace(READ_MORE_REGEX, '')} [${t('commands:lastfm.readMore')}](${regex[1]})`)
      }
      if (album.tracks.track.length > 0) {
        const tracks = album.tracks.track.slice(0, 5)
        const tracksList = tracks.map(track => `\`${track['@attr'].rank}.\` [${track.name}](${formatUrl(track.url)})`)
        embed.addField(t('commands:lastfm.tracks') + ` (${album.tracks.track.length})`, tracksList)
      }
    } catch (e) {
      console.error(e)
    }

    channel.send(embed)
  }
}

class LastfmUser extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'user'
    this.aliases = ['u']

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        missingError: 'commands:lastfm.subcommands.user.missing'
      })
    )
  }

  async run ({ t, author, channel, guild, language }, param) {
    const formatter = new Intl.NumberFormat(language)
    const embed = new SwitchbladeEmbed(author)

    try {
      const { user } = await this.client.apis.lastfm.getUserInfo(param)
      const time = moment(user.registered.unixtime * 1000).format('LLL')

      let { topartists } = await this.client.apis.lastfm.getUserTop(param, 'artists', '1month', 5)
      topartists = topartists.artist

      embed.setAuthor(user.realname ? user.realname : user.name, 'https://i.imgur.com/TppYCun.png', user.url)
        .setThumbnail(user.image[3]['#text'])
        .addField(t('commands:lastfm.playcount'), formatter.format(user.playcount), true)
        .addField(t('commands:lastfm.registered'), time, true)
        .setColor(Constants.LASTFM_COLOR)

      if (user.realname) embed.setTitle(user.name)
      if (topartists.length) {
        const topField = topartists.map(artist => `\`${artist['@attr'].rank}.\` [${artist.name}](${artist.url}) - ${t('commands:lastfm.playcountCount', { times: artist.playcount })}`)
        embed.addField(t('commands:lastfm.topArtists'), topField)
      }

      channel.send(embed)
    } catch (e) {
      throw new CommandError(t('commands:lastfm.subcommands.user.notFound'))
    }
  }
}
