const { SearchCommand, Constants } = require('../../')
const Turndown = require('turndown')
const turndownService = new Turndown()

module.exports = class GoogleCommand extends SearchCommand {
  constructor (client) {
    super({
      name: 'google',
      aliases: ['gogle', 'googl'],
      requirements: { apis: ['gsearch'] },
      embedColor: Constants.GOOGLE_COLOR,
      embedLogoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png'
    }, client)
  }

  async search (_, query) {
    const { items } = await this.client.apis.gsearch.search(query)
    return items
  }

  searchResultFormatter ({ htmlTitle, link }) {
    let title = turndownService.turndown(htmlTitle
      .replace(/\]/g, '\\\\］')
      .replace(/\[/g, '\\\\［'))
    title = link.length > 120 ? title : `[${title}](${link})`
    return `${title}`
  }

  async handleResult ({ channel }, { link }) {
    channel.send(link)
  }
}
