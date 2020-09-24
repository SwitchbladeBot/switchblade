const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const moment = require('moment')

const BASE_URL = 'https://plugins.jetbrains.com'

module.exports = class JetBrainsPlugin extends SearchCommand {
  constructor (client) {
    super({
      name: 'jetbrainsplugin',
      aliases: ['jetbrains', 'jetbrainsplugins'],
      requirements: { apis: ['jetbrainsplugins'] },
      embedColor: Constants.JETBRAINS_PLUGIN,
      embedLogoURL: 'https://i.imgur.com/2djoFWM.png'
    }, client)
  }

  async search (_, query) {
    const res = await this.client.apis.jetbrainsplugins.search(query)
    return res.data.plugins
  }

  searchResultFormatter (i) {
    return `[${i.name} - ${i.downloads.toLocaleString()} downloads](${BASE_URL}${i.link})`
  }

  getRatingEmojis (rating) {
    return (this.getEmoji('ratingstar', '⭐').repeat(Math.floor(rating))) + (this.getEmoji('ratinghalfstar').repeat(Math.ceil(rating - Math.floor(rating))))
  }

  async handleResult ({ t, author, channel, language }, { id, rating }) {
    moment.locale(language)

    const { cdate, name, downloads, urls, preview, vendor, link, tags, icon } = await this.client.apis.jetbrainsplugins.getPluginInfo(id)
    const [{ version }] = await this.client.apis.jetbrainsplugins.getPluginVersion(id)

    const stars = this.getRatingEmojis(rating)

    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:jetbrainsplugin.plugins'), this.embedLogoURL, BASE_URL)
      .setURL(`${BASE_URL}${link}`)
      .setTitle(name)
      .setDescriptionFromBlockArray([
        [
          preview
        ],
        [
          t('commands:jetbrainsplugin.by', { name: vendor.name, url: vendor.url })
        ],
        [
          t('commands:jetbrainsplugin.installs', { count: downloads.toLocaleString(language) }),
          stars
        ],
        [
          tags.map((t) => `\`${t.name}\``).join(', ')
        ],
        [
          t('commands:jetbrainsplugin.lastUpdate', { ago: moment(cdate).fromNow(), version })
        ],
        [
          `[${t('commands:jetbrainsplugin.license')}](${urls.licenseUrl})`,
          urls.docUrl ? `[${t('commands:jetbrainsplugin.documentation')}](${urls.docUrl})` : '',
          `[${t('commands:jetbrainsplugin.download')}](${BASE_URL}${link})`
        ]
      ])

    if (icon) embed.setThumbnail(`${BASE_URL}${icon.replace(/svg$/, 'png')}`)

    channel.send(embed)
  }
}
