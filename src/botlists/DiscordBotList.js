const { BotList } = require('../structures')
const snekfetch = require('snekfetch')

module.exports = class DiscordBotList extends BotList {
  constructor () {
    super()

    this.name = 'discordbotlist.com'
    this.envVars = ['DISCORDBOTLIST_TOKEN']
  }

  postStatistics ({ id, shardId, userCount, serverCount, voiceConnections }) {
    return snekfetch
      .post(`https://discordbotlist.com/api/bots/${id}/stats`)
      .set('Authorization', process.env.DISCORDBOTLIST_TOKEN)
      .send({
        guilds: serverCount,
        shard_id: shardId,
        users: userCount,
        voice_connections: voiceConnections
      })
  }
}
