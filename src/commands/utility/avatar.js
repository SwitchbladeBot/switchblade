const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Avatar extends Command {
  constructor (client) {
    super(client, {
      name: 'avatar',
      aliases: ['profilepicture', 'pfp'],
      category: 'utility',
      parameters: [{
        type: 'user',
        full: true,
        required: false,
        acceptBot: true
      }]
    })
  }

  run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    user = user || author
    embed.setImage(user.displayAvatarURL)
      .setDescription(t('commands:avatar.someonesAvatar', { user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
