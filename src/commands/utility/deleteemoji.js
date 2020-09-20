const { Command, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class DeleteEmoji extends Command {
  constructor (client) {
    super({
      name: 'deleteemoji',
      aliases: ['delemoji'],
      category: 'utility',
      requirements: { guildOnly: true, permissions: ['MANAGE_EMOJIS'], botPermissions: ['MANAGE_EMOJIS'] },
      parameters: [{
        type: 'emoji',
        sameGuildOnly: true,
        missingError: 'commands:deleteemoji.noEmoji'
      }]
    }, client)
  }

  async run ({ t, channel, author, guild }, emoji) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      await emoji.delete()

      embed.setDescription(t('commands:deleteemoji.deleted', { emoji }))
        .setThumbnail(emoji.url)

      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(`${t('commands:deleteemoji.error')}\n${e.toString()}`)
    }
  }
}
