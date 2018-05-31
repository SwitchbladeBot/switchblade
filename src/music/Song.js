const { EventEmitter } = require('events')

module.exports = class Song extends EventEmitter {
  constructor (data = {}, author) {
    super()

    this.track = data.track
    this.info = data.info
    this.author = author || data.author

    this.on('start', () => {
      console.log('TRACK_STARTED:', this.info.title)
      this.removeAllListeners('queue')
    })
    this.on('queue', () => {
      console.log('TRACK_QUEUED:', this.info.title)
    })
    this.on('end', () => {
      console.log('TRACK_ENDED:', this.info.title)
    })
  }
}
