const { Song } = require('../../structures')
const Constants = require('../../../utils/Constants.js')

module.exports = class MixerSong extends Song {
  constructor (data = {}, requestedBy, Mixer) {
    super(data, requestedBy)
    this._Mixer = Mixer
    this.color = Constants.MIXER_COLOR
  }

  async loadInfo () {
    const [channelId] = this.identifier.split('|')
    const channel = await this._Mixer.getChannel(channelId)
    if (channel) {
      this.richInfo = {
        partnered: channel.partnered,
        viewersTotal: channel.viewersTotal,
        viewersCurrent: channel.viewersCurrent,
        followers: channel.numFollowers,
        language: channel.languageId,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
        bannerUrl: channel.bannerUrl,
        userAvatarUrl: channel.user ? channel.user.avatarUrl : null,
        coverUrl: channel.cover ? channel.cover.url : null
      }
      this.artwork = this.richInfo.userAvatarUrl || this.richInfo.bannerUrl || this.richInfo.coverUrl
    }
    return this
  }

  get backgroundImage () {
    return this.richInfo.bannerUrl || this.richInfo.coverUrl
  }
}
