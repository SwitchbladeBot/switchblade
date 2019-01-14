const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, NumberParameter, StringParameter, CommandError } = CommandStructures

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
    channel.startTyping()

    try {
      const { won, chosenSide } = await this.modules.economy.betflip(author.id, bet, side)
      channel.send(
        new SwitchbladeEmbed(author)
          .setDescription(t(`commands:betflip.${won ? 'victory' : 'loss'}`, { chosenSide, count: bet }))
      )
    } catch (e) {
      switch (e.message) {
        case 'NOT_ENOUGH_MONEY':
          throw new CommandError(t('errors:notEnoughMoney'))
        default:
          throw new CommandError(t('errors:notEnoughMoney'))
      }
    }

    channel.stopTyping()
  }
}
