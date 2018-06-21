const { Command } = require('../../')

module.exports = class StopTyping extends Command {
  constructor (client) {
    super(client)
    this.name = 'stoptyping'
    this.aliases = ['st']
  }

  run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setDescription(`${t('commands:stoptyping.TryingToStop')}`)
    channel.send(embed).then(() => channel.stopTyping())
}