const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class RestrictEmojiAdd extends Command {
  constructor (client, parentCommand) {
    super(client, {
      name: 'add',
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
