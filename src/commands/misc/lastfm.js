const { SubcommandListCommand } = require('../../')

// Formatting url for embeds
const formatUrl = name => name.replace(/\)/g, '%29').replace(/\(/g, '%28').replace(/_/g, '%25')

// Regex to change the Read More from last.fm bio
const READ_MORE_REGEX = /<a href="(https?:\/\/www.last.fm\/music\/[-a-zA-Z0-9@:%_+.~#?&/=]*)">Read more on Last.fm<\/a>/g

module.exports = class LastFM extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'lastfm',
      aliases: ['lfm'],
      requirements: { apis: ['lastfm'] },
      authorString: 'commands:lastfm.serviceName',
      authorImage: 'https://c7.uihere.com/files/934/662/527/last-fm-logo-computer-icons-music-recommender-system-icon-free-image-lastfm-thumb.jpg',
      authorURL: 'https://last.fm',
      embedColor: '#df2703'
    }, client)

    this.formatUrl = formatUrl
    this.READ_MORE_REGEX = READ_MORE_REGEX
  }
}
