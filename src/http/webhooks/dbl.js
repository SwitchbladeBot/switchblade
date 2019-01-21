const { Webhook, SwitchbladeEmbed } = require('../../index')
const { Router } = require('express')
const cors = require('cors')
const corsOptions = {
  origin: 'https://discordbots.org',
  optionsSuccessStatus: 200
}

const INTERVAL = 12 * 60 * 60 * 1000

module.exports = class DBL extends Webhook {
  constructor (client) {
    super(client)
    this.name = 'dbl'
  }

  register (app) {
    const router = Router()

    router.post('/', cors(corsOptions), async (req, res) => {
      const now = Date.now()
      const count = 500
      if (req.headers.authorization !== process.env.DBL_TOKEN) return res.status(403).json({ message: 'Forbidden' })
      if (req.body.bot !== this.client.user.id || req.body.type !== 'upvote') return res.status(400).json({ message: 'Bad Request' })
      const userDoc = await this.client.database.users.get(req.body.user)
      const user = this.client.users.get(req.body.user)
      if (now - userDoc.lastDBLBonusClaim < INTERVAL) return res.status(400).json({ message: 'Bad Request' })
      userDoc.money += count
      userDoc.lastDBLBonusClaim = now
      userDoc.save()
      user.send(new SwitchbladeEmbed(user)
        .setDescription(`**Thanks for voting on DBL!** You've received **${count} Switchcoins** as a bonus.`))
      return res.status(200).json({ message: 'OK' })
    })

    app.use(this.path, router)
  }
}
