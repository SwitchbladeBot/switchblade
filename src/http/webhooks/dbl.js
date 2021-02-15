const { Webhook, SwitchbladeEmbed, EndpointUtils } = require('../../index')
const { Router } = require('express')
const cors = require('cors')
const corsOptions = {
  origin: 'https://top.gg',
  optionsSuccessStatus: 200
}

module.exports = class DBL extends Webhook {
  constructor (client) {
    super({
      name: 'dbl'
    }, client)
  }

  register (app) {
    const router = Router()

    router.post('/', cors(corsOptions), EndpointUtils.handleDBLPayload(), async (req, res) => {
      const user = this.client.users.cache.get(req.body.user)
      try {
        const { collectedMoney } = await this.client.controllers.economy.bonus.claimDBLBonus(user.id)
        user.send(new SwitchbladeEmbed(user)
          .setDescription(`**Thanks for voting on DBL!** You've received **${collectedMoney} Switchcoins** as a bonus.`))
        return res.status(200).json({ message: 'OK' })
      } catch (e) {
        switch (e.message) {
          case 'ALREADY_CLAIMED':
            return res.status(400).json({ error: 'Bonus already claimed' })
          case 'NOT_VOTED':
            return res.status(400).json({ error: 'User hasn\'t voted yet' })
        }
      }
    })

    app.use(this.path, router)
  }
}
