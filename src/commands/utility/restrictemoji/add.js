const { CommandStructures, SwitchbladeEmbed } = require('../../../')
const { Command, CommandParameters, CommandError, RoleParameter, EmojiParameter } = CommandStructures

module.exports = class RestrictEmojiAdd extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'restrictemoji')
    this.name = 'add'

    this.parameters = new CommandParameters(this,
      new EmojiParameter({ full: false, required: true }),
      new RoleParameter({ full: true, required: true })
    )
  }

  async run ({ t, author, channel, guild }, emoji, role) {
    channel.startTyping()
    try {
      const guildEmoji = guild.emojis.get(emoji.id)
      await guildEmoji.addRestrictedRole(role)
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:restrictemoji.subcommands.add.canUse', { role: role.name, emoji: guildEmoji.name }))
      ).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(t('errors:generic'))
    }
  }
}
