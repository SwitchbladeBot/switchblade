const { BotList } = require('../structures')
const snekfetch = require('snekfetch')

module.exports = class BotsForDiscord extends BotList {
  constructor () {
    super()

    this.name = 'botsfordiscord.com'
    this.envVars = ['BOTSFORDISCORD_TOKEN']
  }

  postStatistics ({ id, serverCount }) {
    return snekfetch
      .post(`https://botsfordiscord.com/api/bot/${id}`)
      .set('Authorization', process.env.BOTSFORDISCORD_TOKEN)
      .set('Content-Type', 'application/json')
      .send({
        server_count: serverCount
      })
  }
}
