const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class RestrictEmojiRemove extends Command {
  constructor (client, parentCommand) {
    super(client, {
      name: 'remove',
      parentCommand: 'restrictemoji',
      parameters: [{
        type: 'emoji',
        sameGuildOnly: true
      }, {
        type: 'role',
        full: true
      }]
    })
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
