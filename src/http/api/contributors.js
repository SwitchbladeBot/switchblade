const { Route } = require('../../')
const { Router } = require('express')

module.exports = class Contributors extends Route {
  constructor (client) {
    super(client)
    this.name = 'contributors'
  }

  register (app) {
    const router = Router()

    router.get('/', async (req, res) => {
      const guild = this.client.guilds.get(process.env.BOT_GUILD)
      const roles = guild.roles
      const members = guild.members

      const alreadyFound = []
      const contributorRoles = roles
        .filter(r => r.hoist)
        .sort((a, b) => b.position - a.position)
        .map(role => {
          return {
            id: role.id,
            name: role.name,
            members: members.map(member => {
              if (member.roles.has(role.id) && !member.user.bot && !alreadyFound.includes(member.id) && !process.env.IGNORE_USERS.split(',').includes(member.id)) {
                alreadyFound.push(member.id)
                const { id, user: { username, discriminator, avatar, presence: { status } } } = member
                return { username, discriminator, id, avatar, status }
              }
            }).filter(u => u)
          }
        }).filter(r => r.members.length > 0)

      res.json({ roles: contributorRoles })
    })

    app.use(this.path, router)
  }
}
