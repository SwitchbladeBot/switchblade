const { Connection } = require('../')

module.exports = class LastFM extends Connection {
  constructor (client) {
    super({
      name: 'lastfm'
    }, client)
  }

  get defaultConfig () {
    return {
      scrobbling: false,
      percent: 70
    }
  }

  get configPattern () {
    return {
      percent: p => (p >= 45 && p <= 95)
    }
  }

  async getAuthLink () {
    return `https://www.last.fm/api/auth?api_key=${process.env.LASTFM_KEY}&cb=${this.authCallbackURL}`
  }

  async callback (req) {
    const session = await this.client.apis.lastfm.getSession(req.query.token)
    return {
      sk: session.key
    }
  }

  async getAccountInfo ({ sk }) {
    const account = await this.client.apis.lastfm.getAuthenticatedUserInfo(sk)
    const bestRes = account.image[account.image.length - 1]
    return {
      user: account.name,
      name: account.realname || null,
      url: account.url,
      avatar: bestRes ? bestRes['#text'] : null
    }
  }

  async checkScrobble (scrobble, user) {
    const { lastfm } = await this.client.controllers.connection.getConnections(user)
    return lastfm.connected ? lastfm : false
  }
}
