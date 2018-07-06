const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')
const snekfetch = require('snekfetch')

const INTERVAL = 24 * 60 * 60 * 1000

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'listcord'

    this.requirements = new CommandRequirements(this, {databaseOnly: true})
  }

  async run ({ t, author, channel, prefix, alias, userDocument }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const now = Date.now()
    if (now - userDocument.lastListcordBonusClaim < INTERVAL) {
      const time = moment.duration(INTERVAL - (now - userDocument.lastListcordBonusClaim)).format('h[h] m[m] s[s]')
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:listcord.alreadyClaimed'))
        .setDescription(t('commons:youCanDoItAgainIn', {time}))
    } else {
      const {body} = await snekfetch.get(`https://listcord.com/api/bot/${this.client.user.id}/votes`)
      const userVote = body.find(u => u.id === author.id)
      if (userVote && now - userVote.lastVote < INTERVAL) {
        const count = 500
        userDocument.money += count
        userDocument.lastListcordBonusClaim = now
        userDocument.save()
        embed.setDescription(t('commands:listcord.thanksForVoting', {count: count}))
      } else {
        embed
          .setDescription(t('commands:listcord.howToVote', {link: `https://listcord.com/bot/${this.client.user.id}`, command: `${prefix}${alias || this.name}`}))
      }
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
