const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Avatar extends Command {
  constructor (client) {
    super({
      name: 'avatar',
      aliases: ['profilepicture', 'pfp'],
      category: 'utility',
      parameters: [{
        type: 'user',
        full: true,
        required: false,
        acceptBot: true,
        acceptSelf: true
      }]
    }, client)
  }

  run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    user = user || author
    embed
      .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setDescription(t('commands:avatar.someonesAvatar', { user: user.toString() }))
    channel.send(embed)
  }
}
