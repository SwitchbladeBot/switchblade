const { Player } = require('discord.js-lavalink')
const moment = require('moment')

module.exports = class GuildPlayer extends Player {
  constructor (options = {}) {
    super(options)

    this.on('end', ({ reason }) => {
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
  }

  event (message) {
    if (message.op === 'playerUpdate') {
      this.state = Object.assign(this.state, { volume: this._volume }, message.state)
    } else {
      super.event(message)
    }
  }

  queueTrack (song) {
    this.queue.push(song)
    song.emit('queue')
  }

  play (song, forcePlay = false, options = {}) {
    if (this.playing && !forcePlay) {
      this.queueTrack(song)
      return false
    }

    super.play(song.track, options)
    this.playingSong = song
    this.volume(this._volume)
    song.emit('start')
    return true
  }

  stop () {
    this.queue = []
    this.emit('stop')
    super.stop()
  }

  next (user) {
    if (this._loop) this.queueTrack(this.playingSong)
    const nextSong = this.queue.shift()
    if (nextSong) {
      this.play(nextSong, true)
      return nextSong
    } else {
      super.stop()
      this.playingSong.emit('stop', user)
      this.emit('stop', user)
    }
  }

  volume (volume = 50) {
    this._volume = volume
    super.volume(volume)
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
}
