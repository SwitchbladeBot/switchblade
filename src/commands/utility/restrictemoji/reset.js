const { CommandStructures, SwitchbladeEmbed } = require('../../../')
const { Command, CommandParameters, CommandError, EmojiParameter } = CommandStructures

module.exports = class RestrictEmojiReset extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'restrictemoji')
    this.name = 'reset'

    this.parameters = new CommandParameters(this,
      new EmojiParameter({ full: false, required: true })
    )
  }

  async run ({ t, author, channel, guild }, emoji) {
    channel.startTyping()
    try {
      const guildEmoji = guild.emojis.get(emoji.id)
      await guildEmoji.edit({ roles: [] })
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:restrictemoji.subcommands.reset.resetted', { emoji: guildEmoji.name }))
      ).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(t('errors:generic'))
    }
  }
}
