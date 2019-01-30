const { BotList } = require('../structures')
const snekfetch = require('snekfetch')

module.exports = class DiscordBots extends BotList {
  constructor () {
    super()

    this.name = 'discordbots.org'
    this.envVars = ['DISCORDBOTS_TOKEN']
  }

  postStatistics ({ id, shardId, shardCount, serverCount }) {
    return snekfetch
      .post(`https://discordbots.org/api/bots/${id}/stats`)
      .set('Authorization', process.env.DBL_TOKEN)
      .send({
        server_count: serverCount,
        shard_id: shardId,
        shard_count: shardCount
      })
  }
}
