const { Route } = require('../../')
const { Router } = require('express')

module.exports = class Guilds extends Route {
  constructor (client) {
    super(client)
    this.name = 'guilds'
  }

  register (app) {
    const router = Router()

    router.post('/common', async (req, res) => {
      const { body } = req
      if (body) {
        const guilds = body instanceof Array ? body : body.guilds instanceof Array ? body.guilds : null
        if (guilds) {
          const common = guilds.filter(id => this.client.guilds.has(id))
          return res.json(common)
        }
      }
      res.status(400).json({ error: 'Invalid request' })
    })

    router.get('/:id/members/', async (req, res) => {
      const guild = this.client.guilds.get(req.params.id)
      if (guild) {
        const { id, name, icon, memberCount } = guild
        return res.json({ id, name, icon, memberCount })
      }
      res.status(404).json({ error: 'Guild not found' })
    })

    app.use(this.path, router)
  }
}
