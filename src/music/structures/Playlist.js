const { EventEmitter } = require('events')
const Song = require('./Song.js')

module.exports = class Playlist extends EventEmitter {
  constructor (songs = [], requestedBy) {
    super()

    this.songs = songs.map(s => new Song(s, requestedBy))
    this.requestedBy = requestedBy
  }
}
