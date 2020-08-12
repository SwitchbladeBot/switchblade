const fetch = require('node-fetch')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const { Permissions } = require('discord.js')

const API_URL = 'https://discordapp.com/api'

module.exports = class EndpointUtils {
  static authenticate ({ client }, adminOnly = false, fetchGuilds = false) {
    return async (req, res, next) => {
      const authorization = req.get('Authorization')
      if (authorization) {
        const [ identifier, token ] = authorization.split(' ')
        if (!identifier || !token) return res.status(400).json({ ok: false })

        switch (identifier) {
          case 'User':
            if (!adminOnly) {
              try {
                const { accessToken } = jwt.verify(token, process.env.JWT_SECRET)
                req.user = await this._fetchUser(client, accessToken)
                if (fetchGuilds) req.guilds = await this._fetchGuilds(client, accessToken)
                return next()
              } catch (e) {
                console.log(e)
                return res.status(401).json({ ok: false })
              }
            }
            break
          case 'Admin':
            if (token === process.env.ADMIN_TOKEN) {
              req.isAdmin = true
              return next()
            }
        }
        return res.status(401).json({ ok: false })
      }
      return res.status(400).json({ ok: false })
    }
  }

  static _fetchUser (client, token) {
    return this._requestDiscord('/users/@me', token)
  }

  static async _fetchGuilds (client, token) {
    const guilds = await this._requestDiscord('/users/@me/guilds', token)
    return Promise.all(guilds.map(async g => {
      const guildEval = await client.shard.broadcastEval(`this.guilds.cache.has('${g.id}')`)
      g.common = guildEval.some(s => s)
      return g
    }))
  }

  static _requestDiscord (endpoint, token) {
    if (!token) throw new Error('INVALID_TOKEN')

    return fetch(`${API_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.ok ? res.json() : Promise.reject(res))
  }

  static handleUser ({ client }) {
    return (req, res, next) => {
      let id = req.params.userId
      if (id) {
        switch (id) {
          case '@me':
            id = req.isAdmin ? client.user.id : req.user.id
            break
          default:
            if (!req.isAdmin && id !== req.user.id) return res.status(403).json({ error: 'Missing permissions!' })
        }
        req.userId = id
        return next()
      }
      return res.status(401).json({ error: 'Invalid user id!' })
    }
  }

  static handleGuild ({ client }, permissions = 'MANAGE_GUILD') {
    return async (req, res, next) => {
      let id = req.params.guildId
      if (id) {
        const guildCaches = await client.shard.broadcastEval(`this.guilds.cache.get('${req.params.guildId}')`)
        const guild = guildCaches.find(g => g)
        if (!guild) return res.status(400).json({ ok: false })
        if (!req.isAdmin) {
          const { roles: userRoles } = await fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${guild.id}/members/${req.user.id}`, {
            headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}` }
          }).then(res => res.json())
          const { roles: guildRoles, owner_id } = await fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${guild.id}`, {
            headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}` }
          }).then(res => res.json())
          const memberPerm = new Permissions(guildRoles.filter(r => userRoles.includes(r.id)).reduce((p, cp) => p | cp.permissions, 0))
          if (permissions && (owner_id !== req.user.id && !memberPerm.has(permissions))) return res.status(403).json({ error: 'Missing permissions!' })
        }
        req.guildId = id
        return next()
      }
      return res.status(401).json({ error: 'Invalid guild id!' })
    }
  }

  static handleDBLPayload () {
    return async (req, res, next) => {
      const authorization = req.get('Authorization')
      if (authorization && authorization === process.env.DBL_WEBHOOK_SECRET) {
        const payload = req.body
        if (payload !== {}) {
          const PayloadSchema = Joi.object().keys({
            bot: Joi.string().min(17).max(18).required(),
            user: Joi.string().min(17).max(18).required(),
            type: Joi.string().equal('upvote').required(),
            query: Joi.string().allow(''),
            isWeekend: Joi.boolean()
          })
          PayloadSchema.validate(payload).then(output => {
            next()
          }).catch(error => res.status(500).json(error))
        } else return res.status(400).json({ error: 'No body' })
      } else return res.status(401).json({ error: 'Invalid Authorization header' })
    }
  }
}
