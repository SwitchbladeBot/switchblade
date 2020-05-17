const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class StopTyping extends Command {
  constructor (client) {
    super({
      name: 'stoptyping',
      aliases: ['st'],
      category: 'utility'
    }, client)
  }

  run ({ t, author, channel }) {
    channel.stopTyping(true)
    channel.send(
      new SwitchbladeEmbed(author).setDescription(t('commands:stoptyping.tryingToStop'))
    )
  }
}
