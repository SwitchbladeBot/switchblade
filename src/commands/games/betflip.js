const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, NumberParameter, StringParameter } = CommandStructures

module.exports = class Betflip extends Command {
  constructor (client) {
    super(client)
    this.name = 'betflip'
    this.category = 'games'
    this.parameters = new CommandParameters(this,
      new NumberParameter({ min: 1, missingError: 'commands:betflip.noBetValue' }),
      new StringParameter({ full: true, whitelist: ['heads', 'tails'], missingError: 'commands:betflip.noCoin' })
    )
  }

  async run ({ channel, author, t }, bet, side) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const { won, chosenSide } = await this.modules.economy.betflip(author.id, bet, side)
      embed.setImage(`https://raw.githubusercontent.com/bolsomito/koi/master/bin/assets/${chosenSide}.png`)
        .setDescription(t(`commands:betflip.${won ? 'victory' : 'loss'}`, { chosenSide, count: bet }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'NOT_ENOUGH_MONEY':
          embed.setTitle(t('errors:notEnoughMoney'))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
