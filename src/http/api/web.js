const { Route, EndpointUtils } = require('../../')
const { Router } = require('express')

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

const API_URL = 'https://discordapp.com/api'

module.exports = class Web extends Route {
  constructor (client) {
    super({
      name: 'web'
    }, client)
  }

  register (app) {
    const router = Router()

    // Login
    router.get('/login', async (req, res) => {
      const { code } = req.query
      if (code) {
        try {
          const {
            access_token: accessToken,
            expires_in: expiresIn,
            refresh_token: refreshToken,
            token_type: tokenType,
            scope
          } = await this._exchangeCode(code)

          res.json({
            token: jwt.sign({
              accessToken,
              refreshToken,
              expiresIn,
              expiresAt: Date.now() + expiresIn * 1000,
              tokenType,
              scope
            }, process.env.JWT_SECRET)
          })
        } catch (e) {
          res.status(403).json({ error: 'Couldn\'t validate authentication code!' })
        }
      } else {
        res.status(400).json({ error: 'An authentication code wasn\'t provided!' })
      }
    })

    // @me
    router.get('/@me', EndpointUtils.authenticate(this, false, true), (req, res) => {
      res.json({ user: req.user, guilds: req.guilds })
    })

    app.use(this.path, router)
  }

  _request (endpoint, token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }

  _exchangeCode (code) {
    return this._tokenRequest({ code, grant_type: 'authorization_code' })
  }

  _refreshToken (refreshToken) {
    return this._tokenRequest({ refresh_token: refreshToken, grant_type: 'refresh_token' })
  }

  _tokenRequest (params = {}) {
    const body = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      scope: 'guilds identify',
      ...params
    })

    return fetch(`${API_URL}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }
}
