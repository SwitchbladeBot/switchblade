const { Route, EndpointUtils } = require('../../')
const { Router } = require('express')
const callbackRedirect = `${process.env.HTTP_URL}/profile/connections`

module.exports = class Connections extends Route {
  constructor (client) {
    super(client)
    this.name = 'connections'
  }

  register (app) {
    const router = Router()

    router.get('/:connName/callback',
      async (req, res) => {
        try {
          const connection = this.client.connections[req.params.connName]
          if (!connection) return res.status(400).json({ error: 'Connection not found' })

          const callback = await connection.callbackHandler(req)
          res.redirect(`${callbackRedirect}?connection=${req.params.connName}&success=${callback}`)
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'Internal server error!' })
        }
      })

    app.use(this.path, router)
  }
}
