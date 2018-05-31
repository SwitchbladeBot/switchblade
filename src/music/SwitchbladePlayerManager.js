const GuildPlayer = require('./GuildPlayer.js')
const Song = require('./Song.js')

const { PlayerManager } = require('discord.js-lavalink')
const snekfetch = require('snekfetch')

const DEFAULT_JOIN_OPTIONS = {selfdeaf: true}

module.exports = class SwitchbladePlayerManager extends PlayerManager {
  constructor (client, nodes = [], options = {}) {
    options.player = GuildPlayer
    super(client, nodes, options)

    this.REST_ADDRESS = `${process.env.LAVALINK_REST_HOST}:${process.env.LAVALINK_REST_PORT}`
  }

  onMessage (message) {
    if (!message || !message.op) return
    const player = this.get(message.guildId)
    if (!player) return
    return player.event(message)
  }

  async fetchSongs (identifier, ytSearch = false) {
    if (ytSearch) identifier = `ytsearch:${identifier}`

    const res = await snekfetch.get(`http://${this.REST_ADDRESS}/loadtracks`)
      .query({ identifier })
      .set('Authorization', process.env.LAVALINK_PASSWORD)
      .catch(err => {
        console.error('fetchSongs error')
        console.error(err)
        return null
      })
    if (!res || !res.body.length) {
      if (!ytSearch) return this.fetchSongs(identifier, true)
      return []
    }
    return res.body
  }

  async fetchSong (identifier, author) {
    const [ songData ] = await this.fetchSongs(identifier)
    if (songData) {
      return new Song(songData, author)
    }
    return null
  }

  async play (song, channel) {
    if (song && song instanceof Song) {
      const host = this.nodes.first().host
      const player = await this.join({
        guild: channel.guild.id,
        channel: channel.id,
        host
      }, DEFAULT_JOIN_OPTIONS)

      player.play(song)
      return song
    }
    return null
  }
}
