const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')

const INTERVAL = 24 * 60 * 60 * 1000

module.exports = class Daily extends Command {
  constructor (client) {
    super(client)
    this.name = 'listcord'

    this.requirements = new CommandRequirements(this, {databaseOnly: true})
  }

  async run ({ t, author, channel, prefix, alias }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const now = Date.now()
    const lastBonus = await this.client.modules.rewards.checkListcordVote(author)
    if (now - lastBonus < INTERVAL) {
      const time = moment.duration(INTERVAL - (now - lastBonus)).format('h[h] m[m] s[s]')
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:listcord.alreadyClaimed'))
        .setDescription(t('commons:youCanDoItAgainIn', {time}))
    } else {
      const vote = await this.client.modules.rewards.validateListcordVote(author)
      if (vote && now - vote.lastVote < INTERVAL) {
        const count = 500
        await this.client.modules.rewards.collectListcordReward(author, count, now)
        embed.setDescription(t('commands:listcord.thanksForVoting', {count: count}))
      } else {
        embed
          .setDescription(t('commands:listcord.howToVote', {link: `https://listcord.com/bot/${this.client.user.id}`, command: `${prefix}${alias || this.name}`}))
      }
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
