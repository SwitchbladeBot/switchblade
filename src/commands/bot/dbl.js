const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')
const snekfetch = require('snekfetch')

const INTERVAL = 24 * 60 * 60 * 1000

module.exports = class DBL extends Command {
  constructor (client) {
    super(client)
    this.name = 'dbl'
    this.alias = ['discordbotlist', 'vote']
    this.category = 'bot'

    this.requirements = new CommandRequirements(this, { databaseOnly: true })
  }

  async run ({ t, author, channel, prefix, alias, userDocument }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const now = Date.now()
    if (now - userDocument.lastDBLBonusClaim < INTERVAL) {
      const time = moment.duration(INTERVAL - (now - userDocument.lastDBLBonusClaim)).format('h[h] m[m] s[s]')
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:dbl.alreadyClaimed'))
        .setDescription(t('commons:youCanDoItAgainIn', { time }))
    } else {
      const { body } = await snekfetch.get(`https://discordbots.org/api/bots/445277324175474689/check?userId=${author.id}`, {
        headers: {
          'Authorization': process.env.DBL_TOKEN
        }
      })

      if (body.voted === 1) {
        const count = 500
        userDocument.money += count
        userDocument.lastDBLBonusClaim = now
        userDocument.save()
        embed.setDescription(t('commands:dbl.thanksForVoting', { count: count }))
      } else {
        embed
          .setDescription(t('commands:dbl.howToVote', { link: `https://discordbots.org/bot/${this.client.user.id}/vote`, command: `${prefix}${alias || this.name}` }))
      }
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
