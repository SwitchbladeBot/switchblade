const { Song } = require('../structures')

module.exports = class SoundcloudSong extends Song {
  constructor (data = {}, requestedBy, Soundcloud) {
    super(data, requestedBy)
    this._Soundcloud = Soundcloud
  }

  async loadInfo () {
    const sc = this._Soundcloud
    const track = await sc.getTrack(this.identifier)
    if (track) {
      this.artwork = track.artwork_url.replace('large', 't500x500')
      this.richInfo = {
        playbackCount: track.playback_count,
        downloadCount: track.download_count,
        favoritingsCount: track.favoritings_count,
        waveformUrl: track.waveform_url,
        bpm: track.bpm,
        createdAt: track.created_at,
        streamable: track.streamable,
        downloadable: track.downloadable,
        user: {
          username: track.user.username,
          avatarUrl: track.user.avatar_url,
          url: track.user.permalink_url
        }
      }
    }

    return this
  }
}
