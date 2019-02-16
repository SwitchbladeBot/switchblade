const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const snekfetch = require('snekfetch')

module.exports = class Kiss extends Command {
  constructor (client) {
    super(client)
    this.name = 'kiss'
    this.aliases = ['beijo', 'beijar']
    this.category = 'images'

    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:kiss.noMention', acceptBot: true, acceptSelf: false })
    )
  }

  async run ({ t, channel, author }, user) {
    const { body } = await snekfetch.get('https://nekos.life/api/v2/img/kiss')
    const embed = new SwitchbladeEmbed(author)
    embed.setImage(body.url)
      .setDescription(t('commands:kiss.success', { kisser: author, kissed: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
