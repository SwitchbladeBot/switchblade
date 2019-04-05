const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const DATADRAGON_URL = 'https://ddragon.leagueoflegends.com'
const API_URL = 'https://na1.api.riotgames.com'

module.exports = class LeagueOfLegends extends APIWrapper {
  constructor () {
    super()
    this.name = 'lol'
    this.envVars = ['RIOT_API_KEY']
    this.version = null
  }

  async selectLanguage (language = 'en_US') {
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

  async fetchChampionByName (champion, language) {
    return new Promise(async (resolve, reject) => {
      champion = champion.replace("'", '').split(' ')
      const champions = await this.fetchChampions()
      const name = Object.keys(champions).find(key => key.toLowerCase() === champion.join('').toLowerCase())
      if (!name) return reject(new Error('INVALID_CHAMPION'))

      const { id } = champions[name]
      const lang = await this.selectLanguage(language)
      return this.request(`/cdn/${this.version}/data/${lang}/champion/${id}.json`).then(u => resolve(u.data[id]))
    })
  }

  async fetchChampionById (champId, language) {
    return new Promise(async (resolve, reject) => {
      const champions = await this.fetchChampions()
      const name = Object.keys(champions).find(i => champions[i].key === champId.toString())
      if (!name) return reject(new Error('INVALID_CHAMPION'))

      const { id } = champions[name]
      const lang = await this.selectLanguage(language)
      return this.request(`/cdn/${this.version}/data/${lang}/champion/${id}.json`).then(u => resolve(u.data[id]))
    })
  }

  async fetchChampionRotation (language = 'en_US', newPlayer = false) {
    const payload = await this.request('/lol/platform/v3/champion-rotations', false).then(u => u)

    let champions = []
    const championIds = newPlayer ? payload.freeChampionIdsForNewPlayers : payload.freeChampionIds

    for (var i in championIds) {
      const champion = await this.fetchChampionById(championIds[i], language)
      champions.push(champion)
    }

    return champions
  }

  request (endpoint, useDataDragon = true) {
    const url = useDataDragon ? DATADRAGON_URL : API_URL
    return snekfetch.get(url + endpoint)
      .set('X-Riot-Token', process.env.RIOT_API_KEY)
      .then(r => r.body)
  }
}
