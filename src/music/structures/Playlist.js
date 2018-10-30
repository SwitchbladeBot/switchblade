const { EventEmitter } = require('events')
const moment = require('moment')

const Song = require('./Song.js')

module.exports = class Playlist extends EventEmitter {
  constructor (data = {}, songs = [], requestedBy) {
    super()

    this.identifier = data.identifier
    this.source = data.source
    this.requestedBy = requestedBy
    this.songs = songs
  }

  loadInfo () {
    this.songs = this.songs.map(s => new Song(s, this.requestedBy))
    return this
  }

  get length () {
    return this.songs.reduce((l, s) => l + s.length, 0)
  }

  get formattedDuration () {
    if (this.isStream) return ''
    return moment.duration(this.length).format(this.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss', { trim: false })
  }
}
