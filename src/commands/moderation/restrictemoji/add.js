const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class RestrictEmojiAdd extends Command {
  constructor (client) {
    super({
      name: 'add',
      parent: 'restrictemoji',
      parameters: [{
        type: 'emoji',
        sameGuildOnly: true
      }, {
        type: 'role',
        full: true
      }]
    }, client)
  }

  async run ({ t, author, channel, guild }, emoji, role) {
    channel.startTyping()
    try {
      await emoji.roles.add(role)
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:restrictemoji.subcommands.add.canUse', { role: role.name, emoji: emoji.name }))
      ).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(t('errors:generic'))
    }
  }
}
