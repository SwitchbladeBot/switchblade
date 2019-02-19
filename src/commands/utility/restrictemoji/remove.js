const { CommandStructures, SwitchbladeEmbed } = require('../../../')
const { Command, CommandParameters, CommandError, RoleParameter, EmojiParameter } = CommandStructures

module.exports = class RestrictEmojiRemove extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'restrictemoji')
    this.name = 'remove'

    this.parameters = new CommandParameters(this,
      new EmojiParameter({ full: false, required: true, sameGuildOnly: true }),
      new RoleParameter({ full: true, required: true })
    )
  }

  async run ({ t, author, channel, guild }, emoji, role) {
    channel.startTyping()
    try {
      const guildEmoji = guild.emojis.get(emoji.id)
      await guildEmoji.removeRestrictedRole(role)
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:restrictemoji.subcommands.remove.cantUse', { role: role.name, emoji: guildEmoji.name }))
      ).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(t('errors:generic'))
    }
  }
}
