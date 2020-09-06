const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class Chocolatey extends APIWrapper {
  constructor () {
    super({
      name: 'chocolatey'
    })
  }

  async search (query) {
    return axios.get('https://chocolatey.org/api/v2/Search()', {
      params: {
        $filter: 'IsLatestVersion',
        $skip: 0,
        $top: 10,
        searchTerm: encodeURIComponent(`'${query}'`),
        targetFramework: "''",
        includePrerelease: false
      }
    })
  }
}
