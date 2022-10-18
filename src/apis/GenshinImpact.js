const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://api.genshin.dev'

module.exports = class GenshinImpact extends APIWrapper {
  constructor () {
    super({
      name: 'genshinimpact'
    })

    this.characters = []
  }

  load () {
    this.request('characters', 'all').then(res => {
      this.characters = res.data
    })

    return this
  }

  async getCharacter (character) {
    return this.characters.find(char =>
      char.name.toLowerCase().includes(character.toLowerCase())
    )
  }

  async getCharacterId (character) {
    const { data } = await this.request('characters')
    return data.find(char =>
      character.toLowerCase().includes(char.toLowerCase())
    )
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}/${query}`))
  }
}
