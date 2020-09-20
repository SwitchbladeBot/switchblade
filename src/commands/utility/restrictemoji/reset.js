const { Command, CommandError, SwitchbladeEmbed } = require('../../../')
module.exports = class RestrictEmojiReset extends Command {
  constructor (client) {
    super({
      name: 'reset',
      parent: 'restrictemoji',
      parameters: [{
        type: 'emoji',
        sameGuildOnly: true
      }]
    }, client)
  }

  async run ({ t, author, channel, guild }, emoji) {
    channel.startTyping()
    try {
      await emoji.roles.set([])
      channel.send(
        new SwitchbladeEmbed(author)
          .setTitle(t('commands:restrictemoji.subcommands.reset.reset', { emoji: emoji.name }))
      ).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(t('errors:generic'))
    }
  }
}
