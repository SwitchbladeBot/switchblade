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
    this.champions = []
    this.skins = []
  }

  load () {
    this.request('/realms/na.json')
      .then(data => {
        this.version = data.v
        this.fetchChampions()
          .then(() => {
            this.loadSkins()
          })
      })

    return this
  }

  async loadSkins () {
    const champions = this.champions

    for (const i in champions) {
      const champData = await this.fetchChampion(champions[i].id, 'en_US')

      const skins = champData.skins

      skins.forEach(skin => {
        if (skin.name === 'default') return
        return this.skins.push({ name: skin.name, splashUrl: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champData.id}_${skin.num}.jpg` })
      })
    }
  }

  async selectLanguage (language) {
    const languages = await this.request('/cdn/languages.json')
    const normalizedLanguage = language.replace('-', '_').toLowerCase()
    return languages.find(l => l.toLowerCase() === normalizedLanguage) || 'en_US'
  }

  async getLocale (language, version = this.version) {
    const matchingLanguage = await this.selectLanguage(language)
    return this.request(`/cdn/${this.version}/data/${matchingLanguage}/language.json`).then(u => u.data)
  }

  async fetchChampions (version = this.version) {
    return this.request(`/cdn/${version}/data/en_US/champion.json`).then(u => {
      this.champions = u.data
    })
  }

  async fetchChampion (champion, language, searchById = false) {
    const champions = this.champions
    champion = parseInt(champion) ? champion.toString() : champion.replace("'", '').split(' ')

    const name = Object.keys(champions).find(key => searchById ? (champions[key].key === champion) : (key.toLowerCase() === champion.join('').toLowerCase()))
    if (!name) throw new Error('INVALID_CHAMPION')

    const { id } = champions[name]
    const lang = await this.selectLanguage(language)
    const { data } = await this.request(`/cdn/${this.version}/data/${lang}/champion/${id}.json`)
    return data[id]
  }

  async fetchSkin (skinName) {
    const skin = this.skins.find(s => skinName.toLowerCase() === s.name.toLowerCase())
    if (!skin) throw new Error('INVALID_SKIN')

    return { name: skin.name, splashUrl: skin.splashUrl }
  }

  fetchChampionRotation () {
    return this.request(`/platform/v3/champion-rotations?api_key=${process.env.RIOT_API_KEY}`, true)
  }

  request (endpoint, useRiotApi = false) {
    return fetch((useRiotApi ? RIOT_API_URL : DATADRAGON_URL) + endpoint)
      .then(res => res.json())
  }
}
