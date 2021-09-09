const { Route } = require('../../')
const { Router } = require('express')

module.exports = class Contributors extends Route {
  constructor (client) {
    super({
      name: 'contributors'
    }, client)
  }

  register (app) {
    const router = Router()

    router.get('/', async (req, res) => {
      const guild = this.client.guilds.cache.get(process.env.BOT_GUILD)
      const roles = guild.roles.cache
      const members = await guild.members.fetch()

      const ignoreUsers = process.env.IGNORE_USERS ? process.env.IGNORE_USERS.split(',') : []
      const alreadyFound = []
      const contributorRoles = roles
        .filter(r => r.hoist)
        .sort((a, b) => b.position - a.position)
        .map(role => {
          return {
            id: role.id,
            name: role.name,
            members: members
              .filter(member => member.roles.cache.has(role.id) && !member.user.bot && !alreadyFound.includes(member.id) && !ignoreUsers.includes(member.id))
              .map(member => {
                alreadyFound.push(member.id)
                const { id, user: { username, discriminator, avatar, presence: { status } } } = member
                return { username, discriminator, id, avatar, status }
              })
          }
        }).filter(r => r.members.length > 0)

      res.json({ roles: contributorRoles })
    })

    app.use(this.path, router)
  }
}
