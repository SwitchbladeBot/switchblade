const { BotList } = require('../structures')
const snekfetch = require('snekfetch')

module.exports = class ChangeThis extends BotList {
  constructor () {
    super()

    this.name = 'discordboats.club'
    this.envVars = ['DISCORDBOATSCLUB_TOKEN']
  }

  postStatistics ({ id, serverCount }) {
    return snekfetch
      .post(`https://discordboats.club/api/public/bot/stats`)
      .set('Authorization', process.env.DISCORDBOATS_TOKEN)
      .send({ serverCount })
  }
}
