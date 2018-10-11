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
    const userDoc = await this.client.database.users.get(author.id)
    channel.startTyping()
    if (userDoc.money < bet) {
      embed.setColor(Constants.ERROR_COLOR)
        .setDescription(t('errors:notEnoughMoney'))
    } else {
      const sides = ['heads', 'tails']
      const chosenSide = sides[Math.floor(Math.random() * sides.length)]
      embed.setImage(`https://raw.githubusercontent.com/bolsomito/koi/master/bin/assets/${chosenSide}.png`)
      if (chosenSide === side.toLowerCase()) {
        embed.setDescription(t('commands:betflip.victory', { chosenSide, count: bet }))
        userDoc.money += bet
        userDoc.save()
      } else {
        embed.setDescription(t('commands:betflip.loss', { chosenSide, count: bet }))
        userDoc.money -= bet
        userDoc.save()
      }
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
