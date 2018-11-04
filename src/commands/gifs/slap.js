const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const snekfetch = require('snekfetch')

module.exports = class Slap extends Command {
  constructor (client) {
    super(client)
    this.name = 'slap'
    this.category = 'images'

    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:slap.noMention', acceptBot: true, acceptSelf: false })
    )
  }

  async run ({ t, channel, author }, user) {
    const { body } = await snekfetch.get('https://nekos.life/api/v2/img/slap')
    const embed = new SwitchbladeEmbed(author)
    embed.setImage(body.url)
      .setDescription(t('commands:slap.success', { _author: author, slapped: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
