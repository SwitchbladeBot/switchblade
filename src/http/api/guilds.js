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

    // Editable and non managed roles
    router.get('/:guildId/roles', async (req, res) => {
      const guild = this.client.guilds.get(req.params.guildId)
      if (guild) {
        const roles = guild.roles
          .filter(role => role.name !== '@everyone' && !role.managed && role.editable)
          .map(role => {
            return {
              id: role.id,
              name: role.name,
              color: role.hexColor === '#000000' ? '#b9bbbe' : role.hexColor, // #000000 = default role color
              position: role.position
            }
          })
          .sort((a, b) => b.position - a.position)
        return res.status(200).json({ roles })
      }
      res.status(400).json({ error: 'Guild not found!' })
    })

    // Roles that are toggled as automatic
    router.get('/:guildId/automatic-roles', EndpointUtils.authenticate(this), EndpointUtils.handleGuild(this), async (req, res) => {
      const id = req.guildId
      const guild = this.client.guilds.get(id)
      try {
        const { automaticRoles } = await this.client.modules.configuration.retrieve(id, 'automaticRoles')
        const roles = automaticRoles ? automaticRoles.map(role => {
          return { id: role.id, name: guild.roles.get(role.id).name, onlyBots: role.onlyBots }
        }) : []
        return res.status(200).json({ roles })
      } catch (e) {
        console.log(e)
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

    router.patch('/:guildId/automatic-roles',
      EndpointUtils.authenticate(this),
      EndpointUtils.handleGuild(this),
      async (req, res) => {
        const id = req.guildId
        try {
          await this.client.modules.configuration.setAutoRoles(id, req.body)
          res.status(200).json({ id })
        } catch (e) {
          console.log(e)
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    app.use(this.path, router)
  }
}
