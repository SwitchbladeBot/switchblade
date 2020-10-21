const { APIWrapper } = require('../')
const axios = require('axios')
const cheerio = require('cheerio')

const API_URL = 'https://pypi.org/'

module.exports = class PyPI extends APIWrapper {
  constructor() {
    super({
      name: 'pypiapi'
    })
  }

  async search(query) {
    let html = await axios({
      url: `${API_URL}search/?q=${query}`,
    })
    let parsed = cheerio.load(html.data)
    let data = []

    parsed(".package-snippet").each(function (i, e) {
      let title = parsed(parsed(this).find(".package-snippet__title"))
      let desc = parsed(this).find(".package-snippet__description").text()
      let name = title.find(".package-snippet__name").text()
      data[i] = { "description": desc, "id": name }
    })
    return data
  }

  async info(query) {
    let html = await axios({
      url: `${API_URL}project/${query}`,
    })
    let data = {}
    let parsed = cheerio.load(html.data)
    let title = parsed(".package-header__name").text().trim()
    let desc = parsed(".package-description__summary").text().trim()
    let pip_command = parsed("#pip-command").text().trim()
    let date = parsed(".package-header__date").text().trim()
    parsed(".vertical-tabs__tab").each(
      function (i, e) {
        if (parsed(this).text().trim() == "Homepage") {
          data["package_link"] = parsed(this).attr("href")
        }
      }
    )
    data["description"] = desc
    data["name"] = title
    data["command"] = pip_command
    data["date"] = date

    return data
  }
}