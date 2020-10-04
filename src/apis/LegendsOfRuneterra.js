const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const CDN_URL = 'https://lorassets.switchblade.xyz'

const cardData = {}
const coreData = {}

module.exports = class LegendsOfRuneterra extends APIWrapper {
  constructor () {
    super({
      name: 'legendsofruneterra'
    })
    this.languages = []
  }

  load () {
    this.loadLanguages()
    return this
  }

  async loadLanguages () {
    const response = await this.request('/metadata.json')
    this.languages = response.locales
  }

  selectLanguage (language = 'en_us') {
    const normalizedLanguage = language.replace('-', '_').toLowerCase()
    return this.languages.find(l => l.toLowerCase() === normalizedLanguage) || 'en_us'
  }

  async getCardData (lang) {
    const language = this.selectLanguage(lang)
    return cardData[language] || (cardData[language] = await this.request(`/${language}/data/cards.json`))
  }

  async getCoreData (lang) {
    const language = this.selectLanguage(lang)
    return coreData[language] || (coreData[language] = await this.request(`/${language}/data/globals.json`))
  }

  getCardImageURL (cardCode, lang = 'en_us') {
    const language = this.selectLanguage(lang)
    return `${CDN_URL}/${language}/img/cards/${cardCode}.png`
  }

  getFullCardImageURL (cardCode, lang = 'en_us') {
    const language = this.selectLanguage(lang)
    return `${CDN_URL}/${language}/img/cards/${cardCode}-full.png`
  }

  request (endpoint) {
    return fetch(CDN_URL + endpoint).then(res => res.json())
  }
}
