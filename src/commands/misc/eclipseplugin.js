const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const moment = require('moment')

module.exports = class EclipsePlugin extends SearchCommand {
  constructor (client) {
    super({
      name: 'eclipseplugin',
      aliases: ['eclipseplugins', 'eclipse', 'eclipsemarketplace'],
      requirements: { apis: ['eclipseplugins'] },
      embedColor: Constants.ECLIPSE_PLUGINS_COLOR,
      embedLogoURL: 'https://i.imgur.com/h72SGPd.png'
    }, client)
  }

  async search (_, query) {
    const res = await this.client.apis.eclipseplugins.search(query)
    const node = res.marketplace.search.node
    return Array.isArray(node) ? node : [node]
  }

  searchResultFormatter (i) {
    return `[${i.name} - ${i.owner}](${i.url})`
  }

  async handleResult ({ t, author, channel, language }, { categories, changed, id, image, installstotal, homepageurl, license, name, owner, shortdescription, url, version }) {
    moment.locale(language)

    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setAuthor(t('commands:eclipseplugin.marketplace'), this.embedLogoURL, 'https://marketplace.eclipse.org/')
        .setURL(url)
        .setThumbnail(image)
        .setTitle(name)
        .setDescriptionFromBlockArray([
          [
            shortdescription.replace(/(<([^>]+)>)/gi, '')
          ],
          [
            t('commands:eclipseplugin.by', { name: owner, homepage: homepageurl })
          ],
          [
            t('commands:eclipseplugin.installs', { count: Number(installstotal).toLocaleString(language) })
          ],
          [
            categories.category.map((c) => `\`${c.name}\``).join(', ')
          ],
          [
            t('commands:eclipseplugin.lastUpdate', { ago: moment(Number(changed) * 1e3).fromNow(), version })
          ],
          [
            `**${t('commands:eclipseplugin.license')}**: ${license}`,
            `[${t('commands:eclipseplugin.install')}](http://marketplace.eclipse.org/marketplace-client-intro?mpc_install=${id})`
          ]
        ])
    )
  }
}
