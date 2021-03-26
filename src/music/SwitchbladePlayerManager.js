const { GuildPlayer, Song, SongSearchResult, SongSource, Playlist } = require('./structures')
const {
  Songs: {
    HTTPSong, MixerSong, SoundcloudSong, TwitchSong, YoutubeSong, YoutubePlaylist
  },
  Sources
} = require('./sources')

const MusicUtils = require('./MusicUtils.js')

const { Manager } = require('@lavacord/discord.js')
const fetch = require('node-fetch')

const DEFAULT_JOIN_OPTIONS = { selfdeaf: true }

// Region resolver
/*
const defaultRegions = {
  asia: [ 'sydney', 'singapore', 'japan', 'hongkong' ],
  eu: [ 'london', 'frankfurt', 'amsterdam', 'russia', 'eu-central', 'eu-west', 'southafrica' ],
  us: [ 'us-central', 'us-west', 'us-east', 'us-south' ],
  sam: [ 'brazil' ]
}
*/

/*
const resolveRegion = (region) => {
region = region.replace('vip-', '')
const dRegion = Object.entries(defaultRegions).find(([ , r ]) => r.includes(region))
return dRegion && dRegion[0]
}
*/

module.exports = class SwitchbladePlayerManager extends Manager {
  constructor (client, nodes = [], options = {}) {
    options.player = GuildPlayer
    super(client, nodes, options)

    // TODO: Rest API based on guild's region (or maybe bot's location)
    this.REST_ADDRESS = `${nodes[0].host}:${nodes[0].port}`
    this.REST_PASSWORD = nodes[0].password
  }

  async fetchTracks (identifier) {
    const specialSource = Object.values(Sources).find(source => source.test(identifier))
    if (specialSource) return specialSource
    const params = new URLSearchParams({ identifier })

    const res = await fetch(`http://${this.REST_ADDRESS}/loadtracks?${params.toString()}`, {
      headers: { Authorization: this.REST_PASSWORD }
    }).then(res => res.json()).catch(err => {
      this.client.logError(new Error(`Lavalink fetchTracks ${err}`))
    })

    if (!res) return false
    if (['LOAD_FAILED', 'NO_MATCHES'].includes(res.loadType) || !res.tracks.length) return res.loadType !== 'LOAD_FAILED'

    const songs = res.tracks
    songs.searchResult = res.loadType === 'SEARCH_RESULT'
    return songs
  }

  async loadTracks (identifier, requestedBy) {
    const songs = await this.fetchTracks(identifier)
    if (songs && Object.getPrototypeOf(songs) === SongSource) {
      return SongSearchResult.from(songs.provide(this, identifier, requestedBy), false)
    }

    if (songs && songs.length > 0) {
      const searchResult = new SongSearchResult(songs.searchResult)
      if (songs.searchResult || songs.length === 1) {
        const [song] = songs
        const source = song.info.source = MusicUtils.getSongSource(song)

        switch (source) {
          case 'http':
            return searchResult.setResult(new HTTPSong(song, requestedBy, this.client.apis.icecast).loadInfo())
          case 'youtube':
            return searchResult.setResult(new YoutubeSong(song, requestedBy, this.client.apis.youtube).loadInfo())
          case 'twitch':
            return searchResult.setResult(new TwitchSong(song, requestedBy, this.client.apis.twitch).loadInfo())
          case 'soundcloud':
            return searchResult.setResult(new SoundcloudSong(song, requestedBy, this.client.apis.soundcloud).loadInfo())
          case 'mixer':
            return searchResult.setResult(new MixerSong(song, requestedBy, this.client.apis.mixer).loadInfo())
          default:
            return searchResult.setResult(new Song(song, requestedBy).loadInfo())
        }
      } else {
        const pInfo = MusicUtils.getPlaylistInfo(identifier)
        switch (pInfo.source) {
          case 'youtube':
            return searchResult.setResult(new YoutubePlaylist(pInfo, songs, requestedBy, this.client.apis.youtube).loadInfo())
          default:
            return searchResult.setResult(new Playlist(pInfo, songs, requestedBy).loadInfo())
        }
      }
    }

    return new SongSearchResult(typeof songs === 'boolean' ? songs : true)
  }

  async play (song, channel) {
    if (song && song instanceof Song) {
      // const host = this.getIdealHost(channel.guild.region)
      const player = await this.join({
        guild: channel.guild.id,
        channel: channel.id,
        node: '1'
      }, DEFAULT_JOIN_OPTIONS)
      await player.play(song)
      return song
    }
    return null
  }

  /*
  getIdealHost (region) {
    region = resolveRegion(region)
    const { host } = (region && this.nodes.find(n => n.ready && n.region === region)) || this.nodes.first()
    return host
  }
  */
}
