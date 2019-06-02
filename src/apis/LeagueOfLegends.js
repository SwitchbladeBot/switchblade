const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://ddragon.leagueoflegends.com'

module.exports = class LeagueOfLegends extends APIWrapper {
  constructor () {
    super({
      name: 'lol'
    })

    this.version = null
  }

  async getVersion () {
    return this.request(`/realms/na.json`).then(data => {
      this.version = data.v
      return data.v
    })
  }

  async selectLanguage (language) {
    const languages = await this.request('/cdn/languages.json')
    const normalizedLanguage = language.replace('-', '_').toLowerCase()
    const matchingLanguage = languages.find(l => l.toLowerCase() === normalizedLanguage)
    return matchingLanguage || 'en_US'
  }

  async getLocale (language) {
    const matchingLanguage = await this.selectLanguage(language)
    return this.request(`/cdn/${this.version}/data/${matchingLanguage}/language.json`).then(u => {
      return this.convertBufferToJson(u).then(u => u.data)
    })
  }

  async fetchChampions (version = this.version) {
    if (!version) version = await this.getVersion()
    return this.request(`/cdn/${version}/data/en_US/champion.json`).then(u => {
      return this.convertBufferToJson(u).then(u => u.data)
    })
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
    return fetch(API_URL + endpoint)
      .then(res => res.json())
  }

  async convertBufferToJson (buffer) {
    const bufferAsJson = JSON.stringify(buffer)
    const bufferOriginal = Buffer.from(JSON.parse(bufferAsJson).data)
    return JSON.parse(bufferOriginal.toString('utf8'))
  }
}
