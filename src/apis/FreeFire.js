const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const REQUEST_URL = 'https://ffstaticdata.switchblade.xyz'

const weaponData = {}

module.exports = class FreeFire extends APIWrapper {
  constructor () {
    super({
      name: 'freefire'
    })
    this.languages = []
  }

  load () {
    this.loadLanguages()
    return this
  }

  async loadLanguages () {
    const { locales } = await this.request('/metadata.json')
    this.languages = locales
  }

  selectLanguage (language = 'en_US') {
    const normalizedLanguage = language.slice(0, 2)
    return this.languages.find(l => l.toLowerCase() === normalizedLanguage) || 'en'
  }

  async getWeaponData (lang) {
    const language = this.selectLanguage(lang)
    return weaponData[language] || (weaponData[language] = await this.request(`/${language}/weapons.json`))
  }

  request (endpoint) {
    return fetch(REQUEST_URL + endpoint).then(res => res.json())
  }
}
