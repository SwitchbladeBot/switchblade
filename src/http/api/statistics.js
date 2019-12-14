const { Route } = require('../../')
const { Router } = require('express')
const i18next = require('i18next')

module.exports = class Statistics extends Route {
  constructor (client) {
    super({
      name: 'statistics'
    }, client)
  }

  register (app) {
    const router = Router()

    router.get('/', (req, res) => {
      res.status(200).json({
        serverCount: this.client.guilds.size,
        userCount: this.client.users.size,
        uptime: process.uptime() * 1000,
        commandCount: this.client.commands.length,
        languageCount: Object.keys(i18next.store.data).length
      })
    })

    app.use(this.path, router)
  }
}
