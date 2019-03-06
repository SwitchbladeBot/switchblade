const { Connection } = require('../')

module.exports = class LastFM extends Connection {
  constructor (client) {
    super(client)
    this.name = 'lastfm'
  }

  async getAuthLink () {
    return `https://www.last.fm/api/auth?api_key=${process.env.LASTFM_KEY}&cb=${this.authCallbackURL}`
  }

  async callback (req) {
    const session = await this.client.apis.lastfm.getSession(req.query.token)
    console.log(session)
    return session.key
  }
}
