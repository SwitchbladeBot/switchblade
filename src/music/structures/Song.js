const { EventEmitter } = require('events')

module.exports = class Song extends EventEmitter {
  constructor (data = {}, requestedBy) {
    super()

    this.track = data.track
    this.requestedBy = requestedBy || data.requestedBy

    this.identifier = data.info.identifier
    this.isSeekable = data.info.isSeekable
    this.author = data.info.author
    this.length = data.info.length
    this.isStream = data.info.isStream
    this.position = data.info.position
    this.title = data.info.title
    this.uri = data.info.uri

    this.richInfo = null

    this.on('start', () => {
      console.log('TRACK_STARTED:', this.title)
      this.removeAllListeners('queue')
    })
    this.on('queue', () => {
      console.log('TRACK_QUEUED.:', this.title)
    })
    this.on('end', () => {
      console.log('TRACK_ENDED..:', this.title)
    })
  }
}
