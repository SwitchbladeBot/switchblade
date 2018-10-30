const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class StopTyping extends Command {
  constructor (client) {
    super(client)
    this.name = 'stoptyping'
    this.aliases = ['st']
    this.category = 'utility'
  }

  run ({ t, author, channel }) {
    channel.stopTyping(true)
    channel.send(
      new SwitchbladeEmbed(author).setDescription(t('commands:stoptyping.tryingToStop'))
    )
  }
}
