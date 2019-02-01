const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class DBL extends Command {
  constructor (client) {
    super(client)
    this.name = 'dbl'
    this.alias = ['discordbotlist', 'vote']
    this.category = 'bot'
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    channel.send(new SwitchbladeEmbed(author)
      .setDescription(t('commands:dbl.howToVote', { link: `https://discordbots.org/bot/${this.client.user.id}/vote` })))
      .then(() => channel.stopTyping())
  }
}
