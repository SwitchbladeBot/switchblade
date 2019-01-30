const { BotList } = require('../structures')
const snekfetch = require('snekfetch')

module.exports = class BotListSpace extends BotList {
  constructor () {
    super()

    this.name = 'botlist.space'
    this.envVars = ['BOTLISTSPACE_TOKEN']
  }

  postStatistics ({ id, serverCount }) {
    return snekfetch
      .post(`https://api.botlist.space/v1/bots/${id}`)
      .set('Authorization', process.env.BOTLISTSPACE_TOKEN)
      .set('Content-Type', 'application/json')
      .send({
        server_count: serverCount
      })
  }
}
