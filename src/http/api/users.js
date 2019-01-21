const { Route, EndpointUtils } = require('../../index')
const { Router } = require('express')

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day
const DAILY_BONUS = () => Math.ceil(Math.random() * 2000) + 750

module.exports = class Users extends Route {
  constructor (client) {
    super(client)
    this.name = 'users'
    this.subRoutes = [new Economy(client, this)]
  }
}

class Economy extends Route {
  constructor (client, parentRoute) {
    super(client, parentRoute)
    this.name = 'economy'
  }

  register (app) {
    const router = Router()

    // Daily
    router.post('/daily/:id', EndpointUtils.authenticate(), EndpointUtils.handleUser(this), async (req, res) => {
      const id = req.id

      const doc = await this.client.database.users.get(id)
      const { lastDaily } = doc

      const now = Date.now()
      if (now - lastDaily < DAILY_INTERVAL) {
        return res.status(400).json({ error: 'IN_INTERVAL', lastDaily, interval: DAILY_INTERVAL - (now - lastDaily) })
      }

      const claimed = Math.abs(Math.round(DAILY_BONUS()))
      doc.lastDaily = now
      doc.money += claimed
      doc.save()

      res.json({ claimed })
    })

    // Balance
    router.get('/money/:id', EndpointUtils.authenticate(), EndpointUtils.handleUser(this), async (req, res) => {
      const id = req.id
      const { money, lastDaily } = await this.client.database.users.get(id)
      res.status(200).json({ money, lastDaily })
    })

    app.use(this.path, router)
  }
}
