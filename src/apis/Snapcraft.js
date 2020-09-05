const { APIWrapper } = require('..')
const fetch = require('node-fetch')

const API_URL = 'https://api.snapcraft.io/v2/snaps/'

module.exports = class SnapCraftAPI extends APIWrapper {
  constructor () {
    super({
      name: 'snapcraft'
    })
  }

  async searchApp (query) {
    const queryParams = new URLSearchParams({ q: query, fields: 'publisher,version,title,store-url,media,description,channel' })
    const apps = []
    const { results } = await this.request('find?' + queryParams.toString())

    for (const app of results) {
      const icon = app.snap.media.find(img => img.type === 'icon')
      const verified = app.snap.publisher.validation === 'verified'
      apps.push({
        name: app.name,
        title: app.snap.title,
        version: app.revision.version,
        branch: app.revision.channel,
        description: app.snap.description,
        icon: icon ? icon.url : null,
        publisher: {
          displayName: app.snap.publisher['display-name'],
          username: app.snap.publisher.username,
          verified
        },
        storeURL: app.snap['store-url']
      })
    }

    return apps
  }

  request (endpoint) {
    return fetch(API_URL + endpoint, { method: 'GET', headers: { 'Content-Type': 'X-Ubuntu-Series', 'Snap-Device-Series': 16 } }).then(res => res.json())
  }
}
