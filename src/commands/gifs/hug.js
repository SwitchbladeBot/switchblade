const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const snekfetch = require('snekfetch')

module.exports = class Hug extends Command {
  constructor (client) {
    super(client)
    this.name = 'hug'
    this.category = 'images'

    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:hug.noMention', acceptBot: true, acceptSelf: false })
    )
  }

  async run ({ t, channel, author }, user) {
    const { body } = await snekfetch.get('https://nekos.life/api/v2/img/hug')
    const embed = new SwitchbladeEmbed(author)
    embed.setImage(body.url)
      .setDescription(t('commands:hug.success', { hugger: author, hugged: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
