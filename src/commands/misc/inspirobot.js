const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class InspiroBot extends Command {
  constructor (client) {
    super(client)
    this.name = 'inspirobot'
    this.aliases = ['inspiro', 'ibot']
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('http://inspirobot.me/api?generate=true')
    embed
      .setImage(body.toString('utf8'))
      .setDescription(t('commands:inspirobot.quote'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
