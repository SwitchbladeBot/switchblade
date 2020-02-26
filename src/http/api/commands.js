const { Route } = require('../../')
const { Router } = require('express')

module.exports = class Commands extends Route {
  constructor (client) {
    super({
      name: 'commands'
    }, client)
  }

  register (app) {
    const router = Router()

    router.get('/', (req, res) => {
      const t = this.client.i18next.getFixedT(req.query.language || 'en-US')

      const commands = this.client.commands.filter(c => !c.hidden)
      const categories = commands
        .map(c => c.category)
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => t(`categories:${a}`).localeCompare(t(`categories:${b}`)))
        .map(category => ({
          name: category,
          displayName: t(`categories:${category}`),
          commands: commands.filter(c => c.category === category)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => c.asJSON(t))
        }))

      res.status(200).json({ categories })
    })

    router.get('/:name', (req, res) => {
      const t = this.client.i18next.getFixedT(req.query.language || 'en-US')

      const command = this.client.commands.find(c => c.name === req.params.name)
      if (!command) return res.status(400).json({ error: 'Invalid command!' })

      return res.status(200).json({ command: command.asJSON(t) })
    })

    app.use(this.path, router)
  }
}
