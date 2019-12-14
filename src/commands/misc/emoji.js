const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Emoji extends Command {
  constructor (client) {
    super({
      name: 'emoji',
      aliases: ['enlarge', 'bigemoji'],
      parameters: [{
        type: 'emoji', full: true
      }]
    }, client)
  }

  run ({ t, author, channel }, emoji) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(emoji.url)
      .setDescription(t('commands:emoji.hereIsYourEmoji'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
