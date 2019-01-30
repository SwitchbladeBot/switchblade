const { BotList } = require('../structures')
const snekfetch = require('snekfetch')

module.exports = class BotsOnDiscord extends BotList {
  constructor () {
    super()

    this.name = 'bots.ondiscord.xyz'
    this.envVars = ['BOTSONDISCORD_TOKEN']
  }

  postStatistics ({ id, serverCount }) {
    return snekfetch
      .post(`https://bots.ondiscord.xyz/bot-api/bots/${id}/guilds`)
      .set('Authorization', process.env.BOTSONDISCORD_TOKEN)
      .set('Content-Type', 'application/json')
      .send({
        guildCount: serverCount
      })
  }
}
