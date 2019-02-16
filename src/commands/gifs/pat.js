const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const snekfetch = require('snekfetch')

module.exports = class Pat extends Command {
  constructor (client) {
    super(client)
    this.name = 'pat'
    this.category = 'images'

    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:pat.noMention', acceptBot: true, acceptSelf: false })
    )
  }

  async run ({ t, channel, author }, user) {
    const { body } = await snekfetch.get('https://nekos.life/api/v2/img/pat')
    const embed = new SwitchbladeEmbed(author)
    embed.setImage(body.url)
      .setDescription(t('commands:pat.success', { _author: author, pat: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
