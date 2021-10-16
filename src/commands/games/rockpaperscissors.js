const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

const handEmojis = ['✊', '✋', '✌']

const objectEmojis = ['🪨', '📄', '✂️']

module.exports = class RockPaperScissorsCommand extends Command {
  constructor (client) {
    super({
      name: 'rockpaperscissors',
      aliases: ['rps'],
      category: 'games',
      parameters: [{
        type: 'string',
        clean: true,
        required: true,
        whitelist: ['rock', 'r', 'paper', 'p', 'scissors', 's'],
        missingError: 'commands:rockpaperscissors.noChoice'
      },
      {
        type: 'number', min: 1, required: false
      },
      [{
        type: 'booleanFlag', name: 'hand', aliases: ['h', 'hands']
      }]]
    }, client)
  }

  async run ({ t, author, channel, flags }, choice, betValue) {
    console.log(betValue)
    const embed = new SwitchbladeEmbed(author)
    const emojis = flags.hand ? handEmojis : objectEmojis
    const botSelected = ['r', 'p', 's'][Math.floor(Math.random() * 3)]
    const botSelectedEmoji = this.getEmoji(botSelected, emojis)

    const result = this.calculateResult(choice, botSelected)

    if (betValue) {
      const balance = await this.client.controllers.economy.balance(author.id)
      if (betValue > balance) throw new CommandError(t('commands:rockpaperscissors.notEnoughMoney'))
      embed.setDescription(t('commands:rockpaperscissors.bet.' + result, { count: betValue }))
      if (result === 'win') {
        await this.client.controllers.economy.give(author.id, betValue)
      } else if (result === 'lose') {
        await this.client.controllers.economy.take(author.id, betValue)
      }
    }

    embed.setTitle(`${this.getEmoji(choice, emojis)} 🆚 ${botSelectedEmoji}`)
    embed.setAuthor(t('commands:rockpaperscissors.' + result))
    if (result !== 'draw') {
      embed.setColor(
        result === 'win' ? Constants.GENERIC_SUCCESS : Constants.GENERIC_FAILURE
      )
    }

    channel.send(embed)
  }

  getEmoji (choice, emojis) {
    const /* valve */index = ['r', 'p', 's'].indexOf(choice[0].toLowerCase())
    return emojis[index]
  }

  // Calculates the result on the choice1's perspective
  calculateResult (_choice1, _choice2) {
    const choice1 = _choice1[0].toLowerCase()
    const choice2 = _choice2[0].toLowerCase()

    if (choice1 === choice2) return 'draw'
    if (choice1 === 'r') return choice2 === 'p' ? 'lose' : 'win'
    if (choice1 === 'p') return choice2 === 's' ? 'lose' : 'win'
    if (choice1 === 's') return choice2 === 'r' ? 'lose' : 'win'
  }
}
