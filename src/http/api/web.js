const { Route } = require('../../index')
const { Router } = require('express')

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

module.exports = class Web extends Route {
  constructor (client) {
    super(client)
    this.name = 'web'
  }

  register (app) {
    const router = Router()

    // Login
    router.get('/login', async (req, res) => {
      const { code } = req.query
      if (code) {
        const token = jwt.sign({ accessToken: 'ifvAnVxaK6ouNFJ5IdlW7KxFPd2E3R' }, process.env.JWT_SECRET)
        res.json({ ok: true, token })
      } else {
        res.status(401).json({ ok: false })
      }
    })

    // @me
    router.get('/@me', async (req, res) => {
      try {
        // TODO: This should be a middleware
        const token = req.get('Authorization')
        if (!token) throw new Error('MISSING_HEADER')

        const { accessToken } = jwt.verify(token, process.env.JWT_SECRET)
        const user = await this._request('/users/@me', accessToken)
        if (req.query.guilds) res.json({ user, guilds: await this._request('/users/@me/guilds', accessToken) })
        else res.json({ user })
      } catch (e) {
        res.status(401).json({ ok: false })
      }
    })

    app.use(this.path, router)
  }

  _request (endpoint, token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`https://discordapp.com/api${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }
}
