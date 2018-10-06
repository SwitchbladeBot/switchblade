const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const handshakeArray = ['https://i.gifer.com/C9M7.gif',
  'https://media1.tenor.com/images/314a2f7c3647ec0b9ba4100f8e35dc2e/tenor.gif?itemid=12270042',
  'https://i.giphy.com/media/lNjOEfoKIplcc/200_d.gif']

module.exports = class handshake extends Command {
  constructor (client) {
    super(client)
    this.name = 'handshake'
    this.aliases = ['hs', 'hands']

    this.parameters = new CommandParameters(this,
      new UserParameter({missingError: 'commands:handshake.noMention', acceptBot: true})
    )
  }

  run ({ t, channel, author }, user) {
    const handshakeImg = handshakeArray[Math.floor(Math.random() * handshakeArray.length)]
    const embed = new SwitchbladeEmbed(author)
    if (user.id === author.id) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:handshake.notYourself'))
        .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:handshake.commandUsage')}`)
    } else {
      embed.setImage(handshakeImg)
        .setDescription(t('commands:handshake.success', { handshaker: author, handshaked: user }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
