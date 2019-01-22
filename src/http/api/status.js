const { Route } = require('../../index')
const { Router } = require('express')

module.exports = class Status extends Route {
  constructor (client) {
    super(client)
    this.name = 'status'
  }

  register (app) {
    const router = Router()

    router.get('/', async (req, res) => {
      res.json({ code: 200, message: 'OK' })
    })

    app.use(this.path, router)
  }
}
