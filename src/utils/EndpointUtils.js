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
      try {
        const guild = await this.getGuild(client, g.id)
        g.common = guild && guild.code !== 50001
      } catch (e) {
        g.common = false
      }
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
        const guild = await this.getGuild(client, req.params.guildId)
        if (!guild) return res.status(400).json({ ok: false })
        if (!req.isAdmin) {
          const { roles: userRoles } = await this.getGuildMember(client, guild.id, req.user.id)
          const memberPerm = new Permissions(guild.roles.filter(r => userRoles.includes(r.id)).reduce((p, cp) => p | cp.permissions, 0))
          if (permissions && (guild.owner_id !== req.user.id && !memberPerm.has(permissions))) return res.status(403).json({ error: 'Missing permissions!' })
        }
        req.guild = guild
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

  // Discord API methods
  static getGuild (client, guildId) {
    return fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${guildId}`, {
      headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}` }
    }).then(res => res.json())
  }

  static getGuildMember (client, guildId, userId) {
    return fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${guildId}/members/${userId}`, {
      headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}` }
    }).then(res => res.json())
  }

  static getGuildMembers (client, guildId) {
    return fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${guildId}/members?limit=1000`, {
      headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}` }
    }).then(res => res.json())
  }

  static getGuildRoles (client, guildId) {
    return fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${guildId}/roles`, {
      headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}` }
    }).then(res => res.json())
  }
}
