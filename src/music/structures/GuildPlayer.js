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

    this.on('stop', () => {
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

  stop () {
    this.queue = []
    this.emit('stop')
    super.stop()
  }

  next (user) {
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

  volume (volume) {
    this._volume = volume
    super.volume(volume)
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
