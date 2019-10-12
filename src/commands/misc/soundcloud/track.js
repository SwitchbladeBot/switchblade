const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class SoundCloudTrack extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'track',
      aliases: ['song', 't', 's'],
      parentCommand: 'soundcloud',
      embedColor: Constants.SOUNDCLOUD_COLOR,
      embedLogoURL: 'https://i.imgur.com/s8e2oin.png'
    })
  }

  async search (context, query) {
    const results = await this.client.apis.soundcloud.searchTrack(query)
    return results
  search (context, query) {
    return this.client.apis.soundcloud.searchTrack(query)
  }

  searchResultFormatter (track) {
    return `[${track.title}](${track.permalink_url}) - ${track.user.username}`
  }

  async handleResult ({ t, channel, author, language }, trackInfo) {
    channel.startTyping()
    const comments = MiscUtils.formatNumber(trackInfo.comment_count, language)
    const downloads = MiscUtils.formatNumber(trackInfo.download_count, language)
    const playbacks = MiscUtils.formatNumber(trackInfo.playback_count, language)
    const favorites = MiscUtils.formatNumber(trackInfo.favoritings_count, language)

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SOUNDCLOUD_COLOR)
      .setAuthor(trackInfo.user.username, trackInfo.user.avatar_url, trackInfo.user.permalink_url)
      .setTitle(trackInfo.title)
      .setURL(trackInfo.permalink_url)
      .setThumbnail((trackInfo.artwork_url || '').replace('large', 't500x500'))
      .setDescription(trackInfo.description)
      .addField(t('commands:soundcloud.createdAt'), moment(new Date(trackInfo.created_at)).format('LLL'), true)
      .addField(t('commands:soundcloud.duration'), MiscUtils.formatDuration(trackInfo.duration), true)
      .addField(t('commands:soundcloud.genre'), trackInfo.genre, true)
      .addField(t('commands:soundcloud.stats'), t('commands:soundcloud.subcommands.track.stats', { comments, downloads, favorites, playbacks }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
