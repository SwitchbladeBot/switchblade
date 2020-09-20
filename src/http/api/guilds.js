const { Route, EndpointUtils } = require('../../')
const { Router } = require('express')

module.exports = class Guilds extends Route {
  constructor (client) {
    super({
      name: 'guilds'
    }, client)
  }

  register (app) {
    const router = Router()

    // Info
    router.get('/:guildId/members', async (req, res) => {
      const guild = this.client.guilds.cache.get(req.params.guildId)
      if (guild) {
        const { id, name, icon, members: { size } } = guild
        const userMembers = guild.members.filter(m => !m.user.bot).size
        const botMembers = size - userMembers
        return res.status(200).json({ id, name, icon, totalMembers: size, userMembers, botMembers })
      }
      res.status(400).json({ error: 'Guild not found!' })
    })

    // Modules
    router.get('/:guildId/modules',
      EndpointUtils.authenticate(this),
      EndpointUtils.handleGuild(this),
      async (req, res) => {
        const id = req.guildId
        try {
          const modules = await Promise.all(
            Object.values(this.client.modules)
              .map(m => m.asJSON(id, req.query.simple ? 'simple' : undefined, req.user.id))
          )
          res.status(200).json({ modules })
        } catch (e) {
          this.client.logError(e, 'HTTP/Modules')
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    router.patch('/:guildId/modules/:modName/state',
      EndpointUtils.authenticate(this),
      EndpointUtils.handleGuild(this),
      async (req, res) => {
        const id = req.guildId
        try {
          const mod = this.client.modules[req.params.modName]
          if (!mod) return res.status(404).json({ error: 'Invalid module name!' })

          await mod.updateState(id, !!req.body.active, req.user.id)
          res.status(200).json({ id })
        } catch (e) {
          this.client.logError(e, 'HTTP/Modules/State')
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    router.patch('/:guildId/modules/:modName/values',
      EndpointUtils.authenticate(this),
      EndpointUtils.handleGuild(this),
      async (req, res) => {
        const id = req.guildId
        try {
          const mod = this.client.modules[req.params.modName]
          if (!mod) return res.status(404).json({ error: 'Invalid module name!' })

          await mod.updateValues(id, req.body.values, req.user.id)
          res.status(200).json({ id })
        } catch (e) {
          this.client.logError(e, 'HTTP/Modules/Values')
          if (e.isJoi) return res.status(400).json({ error: e.name })
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    router.post('/:guildId/modules/:modName/methods/:methodName',
      EndpointUtils.authenticate(this),
      EndpointUtils.handleGuild(this),
      async (req, res) => {
        const id = req.guildId
        try {
          const { modName, methodName } = req.params
          const mod = this.client.modules[modName]
          if (!mod) return res.status(404).json({ error: 'Invalid module name!' })
          if (!mod.apiMethods.includes(methodName)) return res.status(404).json({ error: 'Invalid method name!' })

          const {
            status = 200,
            payload = {}
          } = await mod[methodName](id, req.user.id, req.body, req, res) || {}
          res.status(status).json(payload)
        } catch (e) {
          this.client.logError(e, 'HTTP/Modules/Methods')
          if (e.isJoi) return res.status(400).json({ error: e.name })
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    app.use(this.path, router)
  }
}
