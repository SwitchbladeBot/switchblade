const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const moment = require('moment')
const snekfetch = require('snekfetch')

const INTERVAL = 12 * 60 * 60 * 1000

module.exports = class DBL extends Command {
  constructor (client) {
    super(client)
    this.name = 'dbl'
    this.alias = ['discordbotlist', 'vote']
    this.category = 'bot'

    this.requirements = new CommandRequirements(this, { databaseOnly: true })
  }

  async run ({ t, author, channel, prefix, alias, userDocument }) {
    channel.startTyping()
    channel.send(new SwitchbladeEmbed(author)
      .setDescription(t('commands:dbl.howToVote', { link: `https://discordbots.org/bot/${this.client.user.id}/vote`, command: `${prefix}${alias || this.name}` })))
      .then(() => channel.stopTyping())
  }
}
