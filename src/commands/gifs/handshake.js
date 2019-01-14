const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const handshakeArray = [
  'https://i.gifer.com/C9M7.gif',
  'https://media1.tenor.com/images/314a2f7c3647ec0b9ba4100f8e35dc2e/tenor.gif?itemid=12270042',
  'https://i.giphy.com/media/lNjOEfoKIplcc/200_d.gif'
]

module.exports = class Handshake extends Command {
  constructor (client) {
    super(client)
    this.name = 'handshake'
    this.aliases = ['hs', 'hands']
    this.category = 'images'

    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:handshake.noMention', acceptBot: true, acceptSelf: false })
    )
  }

  run ({ t, channel, author }, user) {
    channel.startTyping()
    const handshakeImg = handshakeArray[Math.floor(Math.random() * handshakeArray.length)]
    const embed = new SwitchbladeEmbed(author)
    embed.setImage(handshakeImg)
      .setDescription(t('commands:handshake.success', { handshaker: author, handshaked: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
