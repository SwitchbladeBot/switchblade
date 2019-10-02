const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class SoundCloudUser extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'user',
      aliases: ['u'],
      parentCommand: 'soundcloud',
      embedColor: Constants.SOUNDCLOUD_COLOR,
      embedLogoURL: 'https://i.imgur.com/s8e2oin.png'
    })
  }

  async search (context, query) {
    const results = await this.client.apis.soundcloud.searchUser(query)
    return results
  }

  searchResultFormatter (user) {
    const str = user.full_name ? `(${user.username})` : ''
    return `[${user.full_name || user.username}](${user.permalink_url}) ${str}`
  }

  async handleResult ({ t, channel, author, language }, user) {
    channel.startTyping()
    const tracks = MiscUtils.formatNumber(user.track_count, language)
    const playlists = MiscUtils.formatNumber(user.playlist_count, language)
    const followers = MiscUtils.formatNumber(user.followers_count, language)
    const followings = MiscUtils.formatNumber(user.followings_count, language)

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SOUNDCLOUD_COLOR)
      .setAuthor(user.username, 'https://i.imgur.com/s8e2oin.png', user.permalink_url)
      .setURL(user.permalink_url)
      .setThumbnail((user.avatar_url || '').replace('large', 't500x500'))

    if (user.description) {
      embed.setDescription(user.description)
    }
    if (user.full_name) {
      embed.setTitle(user.full_name)
    }
    if (user.website) {
      embed.addField(t('commands:soundcloud.website'), `[${user['website-title']}](${user.website})`, true)
    }

    embed.addField(t('commands:soundcloud.stats'), t('commands:soundcloud.subcommands.user.stats', { tracks, playlists, followers, followings }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
