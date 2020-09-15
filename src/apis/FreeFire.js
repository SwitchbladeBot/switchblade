const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const REQUEST_URL = 'https://ffstaticdata.switchblade.xyz'

let weaponData = {}
let languages = []

module.exports = class FreeFire extends APIWrapper {
  constructor () {
    super({
      name: 'freefire'
    })
  }

  load () {
    this.loadLanguages()
    return this
  }

  async loadLanguages () {
    const { locales } = await this.request('/metadata.json')
    languages = locales
  }

  selectLanguage (language = 'en_US') {
    const normalizedLanguage = language.slice(0, 2)
    const matchingLanguage = languages.find(l => l.toLowerCase() === normalizedLanguage)

    return matchingLanguage || 'en'
  }

  async getWeaponData (lang) {
    const language = this.selectLanguage(lang)

    if (!weaponData[language]) weaponData[language] = await this.request(`/${language}/weapons.json`)
    return weaponData[language]
  }

  request (endpoint) {
    return fetch(REQUEST_URL + endpoint).then(res => res.json())
  }
}
