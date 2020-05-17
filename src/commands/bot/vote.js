const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Vote extends Command {
  constructor (client) {
    super({
      name: 'vote',
      category: 'bot'
    }, client)
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    channel.send(new SwitchbladeEmbed(author)
      .setDescription(t('commands:vote.howToVote.dbl', { link: `https://discordbots.org/bot/${this.client.user.id}/vote` })))
      .then(() => channel.stopTyping())
  }
}
