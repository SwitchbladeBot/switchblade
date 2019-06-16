const { Webhook, SwitchbladeEmbed, EndpointUtils } = require('../../index')
const { Router } = require('express')
const cors = require('cors')
const corsOptions = {
  origin: 'https://discordbots.org',
  optionsSuccessStatus: 200
}

module.exports = class DBL extends Webhook {
  constructor (client) {
    super(client)
    this.name = 'dbl'
  }

  register (app) {
    const router = Router()

    router.post('/', cors(corsOptions), EndpointUtils.handleDBLPayload(), async (req, res) => {
      const user = this.client.users.get(req.body.user)
      try {
        const { collectedMoney } = await this.client.modules.economy.bonus.claimDBLBonus(user.id)
        user.send(new SwitchbladeEmbed(user)
          .setDescription(`**Thanks for voting on DBL!** You've received **${collectedMoney} Switchcoins** as a bonus.`))
        this.client.logger.info(`${user.tag} voted`, { label: 'DBL', webhookRequestBody: req.body })
        return res.status(200).json({ message: 'OK' })
      } catch (e) {
        this.client.logger.info(`Did not give voting reward to ${user.tag}`, { label: 'DBL', webhookRequestBody: req.body, reason: e.message })
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
