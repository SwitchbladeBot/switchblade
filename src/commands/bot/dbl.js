const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class DBL extends Command {
  constructor (client) {
    super(client)
    this.name = 'dbl'
    this.alias = ['discordbotlist', 'vote']
    this.category = 'bot'

    this.requirements = new CommandRequirements(this, { databaseOnly: true, apis: ['dbl'] })
  }

  async run ({ t, author, channel, prefix, alias, userDocument }) {
    channel.startTyping()
    channel.send(new SwitchbladeEmbed(author)
      .setDescription(t('commands:dbl.howToVote', { link: `https://discordbots.org/bot/${this.client.user.id}/vote`)))
      .then(() => channel.stopTyping())
  }
}
