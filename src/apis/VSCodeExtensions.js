const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery'

module.exports = class VSCodeExtensions extends APIWrapper {
  constructor () {
    super({
      name: 'vscodeextensions'
    })
  }

  async search (name) {
    const opts = {
      body: JSON.stringify({
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
      }
      ),
      headers: {
        accept: 'application/json;api-version=3.0-preview',
        'content-type': 'application/json',
        'accept-encoding': 'gzip'
      },
      method: 'POST'
    }

    return fetch(API_URL, opts).then((r) => r.text())
  }
}
