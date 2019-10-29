const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const CDN_URL = 'https://cdn.jsdelivr.net/gh/zerinho6/lor-bundles'

let cardData = {}
let coreData = {}
let languages = []

module.exports = class LegendsOfRuneterra extends APIWrapper {
  constructor () {
    super({
      name: 'legendsofruneterra'
    })
  }

  load () {
    this.loadLanguages()
    return this
  }

  async loadLanguages () {
    const response = await this.request('/metadata.json')
    languages = response.locales
  }

  selectLanguage (language = 'en_us') {
    const normalizedLanguage = language.replace('-', '_').toLowerCase()
    const matchingLanguage = languages.find(l => l.toLowerCase() === normalizedLanguage)
    return matchingLanguage || 'en_us'
  }

  async getCardData (lang) {
    const language = this.selectLanguage(lang)
    if (!cardData[language]) cardData[language] = await this.request(`/set1/${language}/data/set1-${language}.json`)
    return cardData[language]
  }

  async getCoreData (lang) {
    const language = this.selectLanguage(lang)
    if (!coreData[language]) coreData[language] = await this.request(`/core/${language}/data/globals-${language}.json`)
    return coreData[language]
  }

  getCardImageURL (cardCode, lang = 'en_us') {
    const language = this.selectLanguage(lang)
    return `${CDN_URL}/set1/${language}/img/cards/${cardCode}.png`
  }

  getFullCardImageURL (cardCode, lang = 'en_us') {
    const language = this.selectLanguage(lang)
    return `${CDN_URL}/set1/${language}/img/cards/${cardCode}-full.png`
  }

  request (endpoint) {
    return fetch(CDN_URL + endpoint).then(res => res.json())
  }
}
