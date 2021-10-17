const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

const suits = [
  Constants.CLUBS,
  Constants.RED_HEART,
  Constants.SPADES,
  Constants.RED_DIAMOND
]

module.exports = class Dicksize extends Command {
  constructor (client) {
    super({
      name: 'drawcard',
      aliases: ['draw', 'drawcards'],
      parameters: [{
        type: 'number',
        required: true,
        missingError: 'commands:drawcard.missingNumber',
        min: 1,
        max: 10
      }]
    }, client)
  }

  async run ({ t, author, channel }, count) {
    let messageDesc = ''

<<<<<<< Updated upstream
=======
    // Limit The Count Between 1 and 10 So It Doesn't Spam Chat
    count = Math.max(Math.min(count, 10), 1)
>>>>>>> Stashed changes

    for (let i = 0; i < count; i++) {
      const suit = suits[Math.round(Math.random() * 3)]
      let card = Math.round(Math.random() * 13)
      if (card > 10 || card === 0) {
        card = t(`commands:drawcard.card${card}`)
      }
      messageDesc += `${suit} ${card}\n`
    }

    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle(t('commands:drawcard.title', { number: count }))
        .setDescription(messageDesc)
        .setColor(Constants.DRAWCARD_COLOR)
    )
  }
}
