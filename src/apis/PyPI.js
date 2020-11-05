const { APIWrapper } = require('../')
const axios = require('axios')
const cheerio = require('cheerio')

const API_URL = 'https://pypi.org/'

module.exports = class PyPI extends APIWrapper {
  constructor () {
    super({
      name: 'pypiapi'
    })
  }

  async search (query) {
    const html = await axios({
      url: `${API_URL}search/?q=${query}`
    })
    const parsed = cheerio.load(html.data)
    const data = []

    parsed('.package-snippet').each(function (i, e) {
      const title = parsed(parsed(this).find('.package-snippet__title'))
      const desc = parsed(this).find('.package-snippet__description').text()
      const name = title.find('.package-snippet__name').text()
      data[i] = { 'description': desc, 'id': name }
    })
    return data
  }

  async info (query) {
    const html = await axios({
      url: `${API_URL}project/${query}`
    })
    const data = {}
    const parsed = cheerio.load(html.data)
    const title = parsed('.package-header__name').text().trim()
    const desc = parsed('.package-description__summary').text().trim()
    const pipCommand = parsed('#pip-command').text().trim()
    const date = parsed('.package-header__date').text().trim()
    parsed('.vertical-tabs__tab').each(
      function (i, e) {
        if (parsed(this).text().trim() === 'Homepage') {
          data['package_link'] = parsed(this).attr('href')
        }
      }
    )
    data.description = desc
    data.name = title
    data.command = pipCommand
    data.date = date

    return data
  }
}
