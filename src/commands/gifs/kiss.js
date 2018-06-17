const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const kissarray = ['https://em.wattpad.com/be664a8e8b471f49798ad367e7e809bea6dff987/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5470763473634d653344323357413d3d2d3331373535353132392e3134373938323930393132363361666232353737353336373930322e676966?s=fit&w=1280&h=1280', 'https://s-media-cache-ak0.pinimg.com/originals/54/31/62/5431628f9c32f0e804689c2c68db8a2a.gif', 'https://s-media-cache-ak0.pinimg.com/originals/af/ec/70/afec70ee60f45a2be98ba1a76385376a.gif']

module.exports = class Kiss extends Command {
  constructor (client) {
    super(client)
    this.name = 'kiss'
    this.aliases = ['beijo', 'beijar']

    this.parameters = new CommandParameters(this,
      new UserParameter({missingError: 'commands:kiss.noMention'})
    )
  }

  run ({ t, channel, author }, user) {
    const kissImg = kissarray[Math.floor(Math.random() * kissarray.length)]
    const embed = new SwitchbladeEmbed(author)
    if (user.id === author.id) {
      embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:kiss.notYourself'))
          .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:kiss.commandUsage')}`)
    } else {
      embed
          .setImage(kissImg)
          .setDescription(t('commands:kiss.success', {kisser: author, kissed: user}))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
