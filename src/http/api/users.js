const { Route, EndpointUtils } = require('../../index')
const { Router } = require('express')

module.exports = class Users extends Route {
  constructor (client) {
    super(client)
    this.name = 'users'
  }

  register (app) {
    const router = Router()

    // Balance
    router.get('/:id/money', EndpointUtils.authenticate(), EndpointUtils.handleUser(this), async (req, res) => {
      const id = req.params.id
      const { money } = await this.client.modules.economy.balance(id)
      res.status(200).json({ id, money })
    })

    app.use(this.path, router)
  }
}
