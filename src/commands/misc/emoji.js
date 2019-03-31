const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Emoji extends Command {
  constructor (client) {
    super(client, {
      name: 'emoji',
      aliases: ['enlarge', 'bigemoji'],
      parameters: [{
        type: 'emoji', full: true
      }]
    })
  }

  run ({ t, author, channel }, emoji) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(emoji.url)
      .setDescription(t('commands:emoji.hereIsYourEmoji'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
