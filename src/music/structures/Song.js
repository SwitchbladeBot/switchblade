const { EventEmitter } = require('events')
const moment = require('moment')

module.exports = class Song extends EventEmitter {
  constructor (data = {}, requestedBy) {
    super()

    this.track = data.track
    this.requestedBy = requestedBy || data.requestedBy

    this.identifier = data.info.identifier
    this.source = data.info.source
    this.isSeekable = data.info.isSeekable
    this.author = data.info.author
    this.length = data.info.length
    this.isStream = data.info.isStream
    this.position = data.info.position
    this.title = data.info.title
    this.uri = data.info.uri

    this.color = '#7289DA'
    this.richInfo = null
    this.startedAt = null

    this.on('start', () => this.handleStart())
    this.on('stop', () => this.removeAllListeners())
  }

  loadInfo () {
    return this
  }

  handleStart () {
    this.removeAllListeners('queue')
    this.startedAt = new Date()
  }

  get formattedDuration () {
    if (this.isStream) return ''
    return moment.duration(this.length).format('hh:mm:ss', { stopTrim: 'm' })
  }

  // Images
  get backgroundImage () {
    return this.artwork
  }

  get mainImage () {
    return this.artwork
  }
}
