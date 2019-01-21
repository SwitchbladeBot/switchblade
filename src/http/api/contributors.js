const { Route } = require('../../index')
const { Router } = require('express')

module.exports = class Contributors extends Route {
  constructor (client) {
    super(client)
    this.name = 'contributors'
  }

  register (app) {
    const router = Router()

    /**
     * @api {get} /contributors Request all Switchblade contributors
     * @apiName GetContributors
     * @apiGroup Contributors
     *
     * @apiSuccess {Object} roles Contributor roles and all members that are in them, ordered from top to bottom
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "roles": [
     *         {
     *           "id": "445204054168174602",
     *           "name": "Back-end Developers",
     *           "members": [
     *             {
     *               "id": "135152303773712384",
     *               "username": "davipatury",
     *               "discriminator": "5570",
     *               "avatar": "38ea62493b1b22541426b99d835b87ba",
     *               "status": "online",
     *             },
     *             (...)
     *           ]
     *         },
     *         (...)
     *       ]
     *     }
     */
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
              if (member.roles.has(role.id) && !member.user.bot && !alreadyFound.includes(member.id)) {
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
