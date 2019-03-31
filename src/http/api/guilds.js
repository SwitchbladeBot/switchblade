const { Route, EndpointUtils } = require('../../')
const { Router } = require('express')

module.exports = class Guilds extends Route {
  constructor (client) {
    super(client)
    this.name = 'guilds'
  }

  register (app) {
    const router = Router()

    // Info
    router.get('/:guildId/members', async (req, res) => {
      const guild = this.client.guilds.get(req.params.guildId)
      if (guild) {
        const { id, name, icon, members: { size } } = guild
        return res.status(200).json({ id, name, icon, memberCount: size })
      }
      res.status(400).json({ error: 'Guild not found!' })
    })

    // Configuration
    router.get('/:guildId/config', EndpointUtils.authenticate(this), EndpointUtils.handleGuild(this), async (req, res) => {
      const id = req.guildId
      try {
        const { prefix, language } = await this.client.modules.configuration.retrieve(id)
        const availableLanguages = Object.keys(this.client.i18next.store.data)
        res.status(200).json({ id, prefix, language, availableLanguages })
      } catch (e) {
        res.status(500).json({ error: 'Internal server error!' })
      }
    })

    router.patch('/:guildId/config',
      EndpointUtils.authenticate(this),
      EndpointUtils.handleGuild(this),
      async (req, res) => {
        const id = req.guildId
        try {
          await this.client.modules.configuration.update(id, req.body)
          res.status(200).json({ id })
        } catch (e) {
          if (e.isJoi) return res.status(400).json({ error: e.name })
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    app.use(this.path, router)
  }
}
