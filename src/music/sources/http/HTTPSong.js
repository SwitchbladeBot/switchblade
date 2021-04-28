const { Song } = require('../../structures')

module.exports = class HTTPSong extends Song {
  constructor (data = {}, requestedBy, Icecast) {
    super(data, requestedBy)
    this._Icecast = Icecast
    this.color = '#2C2F33'
  }

  async loadInfo () {
    const radioInfo = await this._Icecast.fetchMetadata(this.uri).catch(e => null)
    if (radioInfo) {
      this.title = radioInfo.StreamTitle || 'Unknown title'
      this.uri = radioInfo.StreamUrl || this.uri
    }
    return this
  }
}
