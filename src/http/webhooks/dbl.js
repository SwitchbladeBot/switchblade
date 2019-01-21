const { Webhook, SwitchbladeEmbed } = require('../../index')
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

    router.post('/', cors(corsOptions), async (req, res) => {
      if (req.headers.authorization !== process.env.DBL_TOKEN) return res.status(403).json({ message: 'Forbidden' })
      if (req.body.bot !== this.client.user.id || req.body.type !== 'upvote') return res.status(400).json({ message: 'Bad Request' })
      const user = this.client.users.get(req.body.id)
      const { collectedMoney } = await this.client.modules.economy.bonus.claimDBLBonus(user.id)
      user.send(new SwitchbladeEmbed(user)
        .setDescription(`**Thanks for voting on DBL!** You've received **${collectedMoney} Switchcoins** as a bonus.`))
      return res.status(200).json({ message: 'OK' })
    })

    app.use(this.path, router)
  }
}
