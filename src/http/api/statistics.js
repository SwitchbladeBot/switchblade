const { Route } = require('../../')
const { Router } = require('express')
const i18next = require('i18next')

module.exports = class Statistics extends Route {
  constructor (client) {
    super({
      name: 'statistics'
    }, client)
  }

  async register (app) {
    const router = Router()
    const shardGuildCounts = await this.client.shard.fetchClientValues('guilds.cache.size')
    const totalGuildCount = shardGuildCounts.reduce((total, current) => total + current, 0)
    const shardUserCounts = await this.client.shard.broadcastEval('this.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)')
    const totalUserCount = shardUserCounts.reduce((total, current) => total + current, 0)

    router.get('/', (req, res) => {
      res.status(200).json({
        serverCount: totalGuildCount,
        userCount: totalUserCount,
        uptime: process.uptime() * 1000,
        commandCount: this.client.commands.length,
        languageCount: Object.keys(i18next.store.data).length
      })
    })

    app.use(this.path, router)
  }
}
