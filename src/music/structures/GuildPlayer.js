const { Player } = require('discord.js-lavalink')
const moment = require('moment')

module.exports = class GuildPlayer extends Player {
  constructor (options = {}) {
    super(options)

    this.on('end', (data) => {
      if (data.reason === 'REPLACED') return
      this.playingSong.emit('end')
      if (data.reason !== 'STOPPED') this.next()
    })

    this.on('stop', user => {
      this.playingSong.emit('stop', user)
      this.playingSong = null
      this.manager.leave(this.id)
    })

    this.on('error', this.manager.client.logError)

    this.queue = []
    this._volume = 25
  }

  event (message) {
    if (message.op === 'playerUpdate') {
      this.state = Object.assign(this.state, { volume: this._volume }, message.state)
    } else {
      super.event(message)
    }
  }

  play (song, forcePlay = false, options = {}) {
    if (this.playing && !forcePlay) {
      this.queue.push(song)
      song.emit('queue')
      return false
    }

    super.play(song.track, options)
    this.playingSong = song
    this.volume(this._volume)
    song.emit('start')
    return true
  }

  stop (user) {
    this.queue = []
    this.emit('stop', user)
    super.stop()
  }

  next () {
    const nextSong = this.queue.shift()
    if (nextSong) {
      this.play(nextSong, true)
      return nextSong
    } else {
      this.stop()
    }
  }

  volume (volume) {
    this._volume = volume
    super.volume(volume)
  }

  // Helpers

  get formattedElapsed () {
    if (!this.playingSong || this.playingSong.isStream) return ''
    return moment.duration(this.state.position).format(this.playingSong.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss', { trim: false })
  }
}
