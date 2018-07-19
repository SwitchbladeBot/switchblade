const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, NumberParameter, StringParameter } = CommandStructures

module.exports = class Betflip extends Command {
  constructor (client) {
    super(client)
    this.name = 'betflip'
    this.parameters = new CommandParameters(this,
      new NumberParameter({min: 1, missingError: 'commands:betflip.noBetValue'}),
      new StringParameter({full: true, whitelist: ['heads', 'tails'], missingError: 'commands:betflip.noCoin'})
    )
  }

  async run ({channel, author, t}, bet, side) {
    const embed = new SwitchbladeEmbed(author)
    const balance = await this.client.modules.economy.checkBalance(author)
    channel.startTyping()
    if (balance < bet) {
      embed.setColor(Constants.ERROR_COLOR)
        .setDescription(t('errors:notEnoughMoney'))
    } else {
      const sides = ['heads', 'tails']
      const chosenSide = sides[Math.floor(Math.random() * sides.length)]
      embed.setImage(`https://raw.githubusercontent.com/bolsomito/koi/master/bin/assets/${chosenSide}.png`)
      if (chosenSide === side.toLowerCase()) {
        await this.client.modules.economy.addMoney(author, bet)
        embed.setDescription(t('commands:betflip.victory', { chosenSide, count: bet }))
      } else {
        await this.client.modules.economy.removeMoney(author, bet)
        embed.setDescription(t('commands:betflip.loss', { chosenSide, count: bet }))
      }
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
