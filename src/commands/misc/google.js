const { SearchCommand, Constants } = require('../../')
const Turndown = require('turndown')
const turndownService = new Turndown()

module.exports = class GoogleCommand extends SearchCommand {
  constructor (client) {
    super({
      name: 'google',
      aliases: ['gogle', 'googl'],
      embedColor: Constants.GOOGLE_COLOR,
      embedLogoURL: 'https://i.imgur.com/gwYyZwf.png'
    }, client)
  }

  async search (_, query) {
    const { items } = await this.client.apis.gsearch.search(query)
    return items
  }

  searchResultFormatter ({ htmlTitle, link }) {
    let title = turndownService.turndown(htmlTitle)
    title = link.length > 120 ? title : `[${title}](${link})`
    return `${title}`
  }

  async handleResult ({ channel }, { link }) {
    channel.send(link)
  }
}
