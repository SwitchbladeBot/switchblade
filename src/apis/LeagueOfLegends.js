/* eslint-disable no-async-promise-executor */
const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const DATADRAGON_URL = 'https://ddragon.leagueoflegends.com'
const RIOT_API_URL = 'https://na1.api.riotgames.com/lol'

module.exports = class LeagueOfLegends extends APIWrapper {
  constructor () {
    super({
      name: 'lol',
      envVars: ['RIOT_API_KEY']
    })

    this.version = null
  }

  async getVersion () {
    return this.request('/realms/na.json').then(data => {
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

  async getLocale (language, version = this.version) {
    if (!version) version = await this.getVersion()
    const matchingLanguage = await this.selectLanguage(language)
    return this.request(`/cdn/${this.version}/data/${matchingLanguage}/language.json`).then(u => u.data)
  }

  async fetchChampions (version = this.version) {
    if (!version) version = await this.getVersion()
    return this.request(`/cdn/${version}/data/en_US/champion.json`).then(u => u.data)
  }

  async fetchChampion (champion, language, searchById = false) {
    return new Promise(async (resolve, reject) => {
      champion = parseInt(champion) ? champion.toString() : champion.replace("'", '').split(' ')
      const champions = await this.fetchChampions()
      const name = Object.keys(champions).find(key => searchById ? (champions[key].key === champion) : (key.toLowerCase() === champion.join('').toLowerCase()))
      if (!name) return reject(new Error('INVALID_CHAMPION'))

      const { id } = champions[name]
      const lang = await this.selectLanguage(language)
      this.request(`/cdn/${this.version}/data/${lang}/champion/${id}.json`).then(u => resolve(u.data[id]))
    })
  }

  fetchChampionRotation () {
    return this.request(`/platform/v3/champion-rotations?api_key=${process.env.RIOT_API_KEY}`, true)
  }

  request (endpoint, useRiotApi = false) {
    return fetch((useRiotApi ? RIOT_API_URL : DATADRAGON_URL) + endpoint)
      .then(res => res.json())
  }
}
