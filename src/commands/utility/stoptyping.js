const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class StopTyping extends Command {
  constructor (client) {
    super(client, {
      name: 'stoptyping',
      aliases: ['st'],
      category: 'utility'
    })
  }

  run ({ t, author, channel }) {
    channel.stopTyping(true)
    channel.send(
      new SwitchbladeEmbed(author).setDescription(t('commands:stoptyping.tryingToStop'))
    )
  }
}
