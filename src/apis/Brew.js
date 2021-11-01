const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class Brew extends APIWrapper {
  constructor () {
    super({
      name: 'brew'
    })
  }

  async search (formulae) {
    return axios.get(`https://formulae.brew.sh/api/formula/${formulae}.json`).then(res => res.data)
  }
}
