const { Collection } = require('discord.js')
const { Player } = require('@lavacord/discord.js')
const moment = require('moment')

module.exports = class GuildPlayer extends Player {
  constructor (options, id) {
    super(options, id)

    this.on('end', ({ reason }) => {
      this.scrobbleSong(this.playingSong)
      if (reason === 'REPLACED') return
      this.playingSong.emit('end')
      if (reason !== 'STOPPED') this.next()
    })

    this.on('stop', () => {
      this.playingSong = null
      this.manager.leave(this.id)
    })

    this.on('error', this.manager.client.logError)

    this.queue = []
    this._volume = 25
    this._loop = false

    this._previousVolume = null
    this._bassboost = false

    this._listening = new Collection()
  }

  async play (song, forcePlay = false, options = {}) {
    if (this.playing && !forcePlay) {
      this.queueTrack(song)
      return false
    }

    await super.play(song.track, options)
    this.playingSong = song
    this.volume(this._volume)
    song.emit('start')
    return true
  }

  stop () {
    this.queue = []
    this._listening.clear()
    this.emit('stop')
    super.stop()
  }

  leaveOnEmpty (user) {
    this.playingSong.emit('abruptStop', user)
    this.stop()
  }

  next (user) {
    if (this._loop) this.queueTrack(this.playingSong, true)
    const nextSong = this.queue.shift()
    if (nextSong) {
      this.play(nextSong, true)
      this.updateListening()
      this.updateNowPlaying()
      return nextSong
    } else {
      super.stop()
      this.playingSong.emit('stop', user)
      this.emit('stop', user)
    }
  }

  // Queue
  get nextSong () {
    return this.queue[0]
  }

  queueTrack (song, silent = false) {
    this.queueTracks([song], silent)
    return song
  }

  queueTracks (songs, silent = false) {
    this.queue.push(...songs)
    if (!silent) songs.forEach(s => s.emit('queue'))
    return songs
  }

  clearQueue () {
    return this.queue.splice(0)
  }

  shuffleQueue () {
    this.queue = this.queue.sort(() => Math.random() > 0.5 ? -1 : 1)
  }

  removeFromQueue (index) {
    if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS')
    return this.queue.splice(index, 1)[0]
  }

  jumpToIndex (index, ignoreLoop = false) {
    if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS')

    const songs = this.queue.splice(0, index + 1)
    const song = songs.pop()
    if (!ignoreLoop && this._loop) this.queueTracks([this.playingSong, ...songs])
    this.play(song, true)

    return song
  }

  // Volume

  volume (volume = 50) {
    this._volume = volume
    super.volume(volume)
  }

  get bassboosted () {
    return this._bassboost
  }

  bassboost (state = true) {
    this._bassboost = state
    if (state) {
      this._previousVolume = this._volume
      this.volume(150)
      this.equalizer(Array(6).fill(0).map((_, i) => ({ band: i, gain: 1 })))
      return true
    }

    if (this._previousVolume !== null) this.volume(this._previousVolume)
    this.equalizer(Array(6).fill(0).map((_, i) => ({ band: i, gain: 0 })))
    return false
  }

  get looping () {
    return this._loop
  }

  loop (loop = true) {
    this._loop = !!loop
  }

  // Helpers

  get formattedElapsed () {
    if (!this.playingSong || this.playingSong.isStream) return ''
    return moment.duration(this.state.position).format('hh:mm:ss', { stopTrim: 'm' })
  }

  get voiceChannel () {
    return this.client.channels.get(this.channel)
  }

  // Voice Update

  async updateVoiceState (oldMember, newMember) {
    const switchId = newMember.guild.me.user.id
    if (newMember.user.bot && newMember.user.id !== switchId) return
    const { voiceChannel: oldChannel } = oldMember
    const { voiceChannel: newChannel } = newMember
    const isSwitch = newMember.user.id === switchId
    if (newMember.user.bot && !isSwitch) return
    // Voice join
    if (!oldChannel && newChannel) {
      if (isSwitch) this.handleSwitchJoin(newChannel.members)
      else if (newChannel.members.has(switchId)) this.handleNewJoin(newMember.user.id)
      else return
    }
    // Voice leave
    if (oldChannel && !newChannel) {
      if (isSwitch) oldChannel.members.filter(m => !m.user.bot).forEach(m => this._listening.delete(m.user.id))
      if (oldChannel.members.size === 1 && oldChannel.members.has(switchId)) this.leaveOnEmpty(newMember.user.id)
      else if (oldChannel.members.has(switchId)) this._listening.delete(newMember.user.id)
      else return
    }
    if (oldChannel && newChannel) {
      // Voice channel change
      if (oldChannel.id === newChannel.id) return
      if (isSwitch) this.handleSwitchJoin(newChannel.members)
      else if (!oldChannel.equals(newChannel)) {
        if (newChannel.members.has(switchId)) this.handleNewJoin(newMember.user.id)
        if (oldChannel.members.has(switchId)) this._listening.delete(newMember.user.id)
      }
    }
  }

  async handleNewJoin (user, isSwitch = false) {
    const connections = await this.client.controllers.connection.getConnections(user)
    const lastfm = connections.find(c => c.name === 'lastfm')
    if (!lastfm) return
    this._listening.set(user, { join: new Date(), scrobblePercent: lastfm.config.percent })
    if (!isSwitch) this.client.apis.lastfm.updateNowPlaying(this.playingSong, lastfm.tokens.sk)
  }

  async handleSwitchJoin (members) {
    await Promise.all(members.filter(m => !m.user.bot).map(async ({ id }) => (this.handleNewJoin(id, true))))
    this.updateNowPlaying()
  }

  updateListening () {
    this._listening.forEach(({ scrobblePercent }, k) => this._listening.set(k, { join: new Date(), scrobblePercent }))
  }

  // Last.fm
  async getAbleToScrobble () {
    if (this.playingSong.isSteam) return []
    const map = this._listening.map(async (s, u) => {
      const connections = await this.client.controllers.connection.getConnections(u)
      const user = { id: u, config: s }
      return { user, lastfm: connections.find(c => c.name === 'lastfm') }
    })
    const promise = await Promise.all(map)
      .then(conns => conns.filter(({ lastfm }) => lastfm ? lastfm.config.scrobbling : false))
    return promise
  }

  async updateNowPlaying () {
    const ableToUpdate = await this.getAbleToScrobble()
    ableToUpdate.forEach(({ lastfm }) => this.client.apis.lastfm.updateNowPlaying(this.playingSong, lastfm.tokens.sk))
  }

  async scrobbleSong (song) {
    const ableToScrobble = await this.getAbleToScrobble()
    const canScrobble2 = ableToScrobble.map(o => ({
      ...o,
      listenedPercent: (100 * (new Date() - o.user.config.join)) / song.length
    }))
    canScrobble2.filter(p => p.listenedPercent >= p.user.config.scrobblePercent).forEach(({ lastfm, user }) => {
      this.client.apis.lastfm.scrobbleSong(song, user.config.join, lastfm.tokens.sk)
    })
  }
}
