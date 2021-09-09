const { Route } = require('../../')
const { Router } = require('express')

module.exports = class Locales extends Route {
  constructor (client) {
    super({
      name: 'locales'
    }, client)
  }

  register (app) {
    const router = Router()

    router.get('/', async (req, res) => {
      const language = req.query.language

      const languages = Object.entries(this.client.cldr.languages).map(([key, v]) => {
        const targetLang = v[language] || v['en-US']
        return { key, displayName: targetLang[0] || key }
      }).sort((a, b) => a.displayName.localeCompare(b.displayName))

      res.status(200).json({ languages })
    })

    app.use(this.path, router)
  }
}
