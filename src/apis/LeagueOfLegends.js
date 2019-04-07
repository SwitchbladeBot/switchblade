const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://ddragon.leagueoflegends.com'

module.exports = class LeagueOfLegends extends APIWrapper {
  constructor () {
    super()
    this.name = 'lol'
    this.version = null
  }

  async selectLanguage (language) {
    const languages = await this.request('/cdn/languages.json')
    const normalizedLanguage = language.replace('-', '_').toLowerCase()
    const matchingLanguage = languages.find(l => l.toLowerCase() === normalizedLanguage)
    return matchingLanguage || 'en_US'
  }

  async getLocale (language) {
    const matchingLanguage = await this.selectLanguage(language)
    return this.request(`/cdn/${this.version}/data/${matchingLanguage}/language.json`).then(u => u.data)
  }

  async fetchChampions (version = this.version) {
    if (!version) {
      return this.request(`/api/versions.json`).then(versions => {
        this.version = versions[0]
        version = versions[0]
        return this.request(`/cdn/${version}/data/en_US/champion.json`).then(u => u.data)
      })
    } else return this.request(`/cdn/${version}/data/en_US/champion.json`).then(u => u.data)
  }

  async fetchChampion (champion, language) {
    return new Promise(async (resolve, reject) => {
      champion = champion.replace("'", '').split(' ')
      const champions = await this.fetchChampions()
      const name = Object.keys(champions).find(key => key.toLowerCase() === champion.join('').toLowerCase())
      if (!name) return reject(new Error('INVALID_CHAMPION'))

      const { id } = champions[name]
      const lang = await this.selectLanguage(language)
      this.request(`/cdn/${this.version}/data/${lang}/champion/${id}.json`).then(u => resolve(u.data[id]))
    })
  }

  request (endpoint) {
    return snekfetch.get(API_URL + endpoint)
      .then(r => r.body)
  }
}
