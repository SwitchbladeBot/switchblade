const { Command, SwitchbladeEmbed } = require('../../')

const handshakeArray = [
  'https://i.gifer.com/C9M7.gif',
  'https://media1.tenor.com/images/314a2f7c3647ec0b9ba4100f8e35dc2e/tenor.gif?itemid=12270042',
  'https://i.giphy.com/media/lNjOEfoKIplcc/200_d.gif'
]

module.exports = class Handshake extends Command {
  constructor (client) {
    super(client, {
      name: 'handshake',
      aliases: ['hs', 'hands'],
      category: 'images',
      parameters: [{
        type: 'user', acceptBot: true, acceptSelf: false, missingError: 'commands:handshake.noMention'
      }]
    })
  }

  run ({ t, channel, author }, user) {
    const handshakeImg = handshakeArray[Math.floor(Math.random() * handshakeArray.length)]
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(handshakeImg)
      .setDescription(t('commands:handshake.success', { handshaker: author, handshaked: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
