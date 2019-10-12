const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class SoundCloudPlaylist extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'playlist',
      aliases: ['playlists', 'p'],
      parentCommand: 'soundcloud',
      embedColor: Constants.SOUNDCLOUD_COLOR,
      embedLogoURL: 'https://i.imgur.com/s8e2oin.png'
    })
  }

  async search (context, query) {
    const results = await this.client.apis.soundcloud.searchPlaylist(query)
    return results
  search (context, query) {
    return this.client.apis.soundcloud.searchPlaylist(query)
  }

  searchResultFormatter (playlist) {
    return `[${playlist.title}](${playlist.permalink_url}) - ${playlist.user.username}`
  }

  async handleResult ({ t, channel, author, language }, playlist) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SOUNDCLOUD_COLOR)
      .setAuthor(playlist.user.username, playlist.user.avatar_url, playlist.permalink_url)
      .setTitle(playlist.title)
      .setURL(playlist.permalink_url)
      .setThumbnail((playlist.artwork_url || '').replace('large', 't500x500'))
      .addField(t('commands:soundcloud.createdAt'), moment(new Date(playlist.created_at)).format('LLL'), true)
      .addField(t('commands:soundcloud.duration'), MiscUtils.formatDuration(playlist.duration), true)
      .addField(t('commands:soundcloud.tracks'), t('commands:soundcloud.trackCount', { tracks: MiscUtils.formatNumber(playlist.track_count, language) }))

    if (playlist.description) {
      embed.setDescription(playlist.description)
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
