const { PlayerManager } = require('discord.js-lavalink')
const GuildPlayer = require('./GuildPlayer.js')
const snekfetch = require('snekfetch')

const DEFAULT_JOIN_OPTIONS = {selfdeaf: true}

module.exports = class SwitchbladePlayerManager extends PlayerManager {
  constructor (client, nodes = [], options = {}) {
    super(client, nodes, options)
    this.REST_ADDRESS = `${process.env.LAVALINK_REST_HOST}:${process.env.LAVALINK_REST_PORT}`
  }

  add (data) {
    if (!data.id) throw new Error('INVALID_DATA: Object or Class doesn\'t have id property')
    const player = new GuildPlayer(data)
    this.set(player.id, player)
    return player
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

  async play (channel, author, identifier) {
    const [ song ] = await this.fetchSongs(identifier)
    if (song) {
      song.author = author
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
