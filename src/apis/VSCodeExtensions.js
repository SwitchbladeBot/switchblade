const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery'

module.exports = class VSCodeExtensions extends APIWrapper {
  constructor () {
    super({
      name: 'vscodeextensions'
    })
  }

  async search (name) {
    // const opts = {
    //   body: JSON.stringify({
    //     'filters': [
    //       {
    //         'criteria': [
    //           {
    //             'filterType': 10,
    //             'value': name
    //           }
    //         ]
    //       }
    //     ]
    //   }),
    //   headers: {
    //     accept: 'application/json;api-version=3.0-preview',
    //     'content-type': 'application/json; api-version=3.0-preview.1',
    //     'accept-encoding': 'gzip'
    //   },
    //   method: 'POST'
    // }

    return axios({
      data: {
        'filters': [
          {
            'criteria': [
              {
                'filterType': 10,
                'value': name
              }
            ]
          }
        ]
      },
      headers: {
        accept: 'application/json; api-version=3.0-preview',
        'content-type': 'application/json; api-version=3.0-preview.1',
        'accept-encoding': 'gzip'
      },
      url: API_URL,
      method: 'POST'
    })
  }
}
