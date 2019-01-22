const fetch = require('node-fetch')
const Joi = require('joi')

const API_URL = 'https://discordapp.com/api'

module.exports = class EndpointUtils {
  static authenticate (acceptUserToken = true) {
    return async (req, res, next) => {
      const authorization = req.get('Authorization')
      if (authorization) {
        const [ identifier, token ] = authorization.split(' ')
        switch (identifier) {
          case 'User':
            if (acceptUserToken) {
              try {
                const user = await EndpointUtils.fetchOAuthUser(token)
                req.authorizationType = 'USER'
                req.user = user
                return next()
              } catch (e) {
                return res.status(401).json({ error: 'Invalid Bearer token' })
              }
            }
            break
          case 'Admin':
            if (token === process.env.ADMIN_TOKEN) {
              req.authorizationType = 'ADMIN'
              return next()
            }
            break
        }
        return res.status(401).json({ error: 'Invalid Authorization header' })
      }
      return res.status(401).json({ error: 'Missing Authorization header' })
    }
  }

  static async fetchOAuthUser (token) {
    return fetch(`${API_URL}/users/@me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      const user = res.ok && res.json()
      return user || Promise.reject(res)
    })
  }

  static handleUser ({ client }) {
    return (req, res, next) => {
      let id = req.params.id
      if (id) {
        switch (id) {
          case '@me':
            id = req.authorizationType === 'ADMIN' ? client.user.id : req.user.id
            break
          default:
            if (req.authorizationType !== 'ADMIN' && id !== req.user.id) {
              return res.status(401)
            }
        }
        req.id = id
        next()
      }
      return res.status(401)
    }
  }

  static handleDBLPayload () {
    return async (req, res, next) => {
      const authorization = req.get('Authorization')
      if (authorization && authorization === process.env.DBL_WEBHOOK_SECRET) {
        const payload = req.body
        if (payload !== {}) {
          const PayloadSchema = Joi.object().keys({
            bot: Joi.string().min(18).max(18).required(),
            user: Joi.string().min(17).max(18).required(),
            type: Joi.string().equal('upvote').required()
          })
          Joi.validate(payload, PayloadSchema).then(output => {
            next()
          }).catch(error => res.status(500).json(error))
        } else return res.status(400).json({ error: 'No body' })
      } else return res.status(401).json({ error: 'Invalid Authorization header' })
    }
  }
}
