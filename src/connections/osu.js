const { Connection } = require('../')

module.exports = class Osu extends Connection {
  constructor (client) {
    super(client)
    this.name = 'osu'
  }

  async getAuthLink () {
    return `https://osu.ppy.sh/oauth/authorize?response_type=code&client_id=${process.env.OSU_CLIENT_ID}&redirect_uri=${this.authCallbackURL}&state=ok&scope=identify`
  }

  async callback (req) {
    const accessToken = await this.client.apis.osu.getAccessToken(req.query.code)
    return {
      token: accessToken.access_token
    }
  }
}
