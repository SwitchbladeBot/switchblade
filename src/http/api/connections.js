const { Route } = require('../..')
const { Router } = require('express')

module.exports = class Connections extends Route {
  constructor (client) {
    super(client)
    this.name = 'connections'
  }

  register (app) {
    const router = Router()

    router.get('/:connName/authURL',
      async (req, res) => {
        try {
          const connection = this.client.connections[req.params.connName]
          res.redirect(await connection.getAuthLink())
        } catch (e) {
          this.client.logger(e, { label: 'Connections' })
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    app.use(this.path, router)
  }
}
