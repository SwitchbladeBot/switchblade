const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, UserParameter, CommandRequirements } = CommandStructures
const moment = require('moment')

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day

module.exports = class Rep extends Command {
  constructor (client) {
    super(client)
    this.name = 'rep'
    this.category = 'social'

    this.requirements = new CommandRequirements(this, { onlyOldAccounts: true, databaseOnly: true })

    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:rep.noMention', acceptBot: false })
    )
  }

  async run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (user.id === author.id) {
      embed
        .setTitle(t('commands:rep.repYourself'))
    } else {
      const authorData = await this.client.database.users.get(author.id)
      const userData = await this.client.database.users.get(user.id)

      const now = Date.now()
      const date = authorData.lastRep

      if (now - date < DAILY_INTERVAL) {
        const time = moment.duration(DAILY_INTERVAL - (now - date)).format('h[h] m[m] s[s]')
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:rep.alreadyGave'))
          .setDescription(t('commands:rep.againIn', { time }))
      } else {
        authorData.lastRep = now
        userData.rep++
        userData.save() && authorData.save()
        embed.setDescription(t('commands:rep.reputationPoint', { user }))
      }
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
