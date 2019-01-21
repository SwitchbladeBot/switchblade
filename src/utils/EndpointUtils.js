const fetch = require('node-fetch')

const API_URL = 'https://discordapp.com/api'

module.exports = class EndpointUtils {
  static authenticate (acceptUserToken = true) {
    return async (req, res, next) => {
      const authentication = req.get('Authentication')
      if (authentication) {
        const [ tokenType, token ] = authentication.split(' ')
        switch (tokenType) {
          case 'User':
            if (acceptUserToken) {
              try {
                const user = await EndpointUtils.fetchOAuthUser(token)
                req.authenticationType = 'USER'
                req.user = user
                return next()
              } catch (e) {
                return res.status(401).json({ error: 'Invalid Bearer token' })
              }
            }
            break
          case 'Admin':
            if (token === process.env.ADMIN_TOKEN) {
              req.authenticationType = 'ADMIN'
              return next()
            }
            break
        }
        return res.status(401).json({ error: 'Invalid Authentication header' })
      }
      return res.status(401).json({ error: 'Missing Authentication header' })
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
            id = req.authenticationType === 'ADMIN' ? client.user.id : req.user.id
            break
          default:
            if (req.authenticationType !== 'ADMIN' && id !== req.user.id) {
              return res.status(401)
            }
        }
        req.id = id
        next()
      }
      return res.status(401)
    }
  }
}
