const { CommandStructures, SwitchbladeEmbed, CommandParameters } = require('../../')
const { Command, EmojiParameter } = CommandStructures

module.exports = class Emoji extends Command {
  constructor (client) {
    super(client)
    this.name = 'emoji'
    this.aliases = ['enlarge', 'bigemoji']

    this.parameters = new CommandParameters(this,
      new EmojiParameter({ full: true })
    )
  }

  run ({ t, author, channel }, emoji) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(emoji.url)
      .setDescription(t('commands:emoji.hereIsYourEmoji'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
