const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')
const hltb = require('howlongtobeat')
const { auth } = require('google-auth-library')
const hltbService = new hltb.HowLongToBeatService()

module.exports = class HowLongToBeat extends Command {
  constructor (client) {
    super(
      {
        name: 'howlongtobeat',
        aliases: ['hltb'],
        category: 'games',
        parameters: [
          {
            type: 'string',
            missingError: 'commands:howlongtobeat.missingGame'
          }
        ]
      },
      client
    )
  }

  async run ({ t, author, channel, guild }, game) {
    try {
      const gameData = await hltbService.search(game)

      if (gameData.length === 0) {
        throw new CommandError(t('commands:howlongtobeat.invalidGame'), true)
      } else {
        const gameResult = gameData[0]
        let description = ''
        
        gameResult.timeLabels.forEach(timeLabel => {
          description += `${timeLabel[1]} : ${gameResult[timeLabel[0]]} hrs\n`
        })

        channel.send(
          new SwitchbladeEmbed(author)
            .setTitle(t('commands:howlongtobeat.title', { game: gameResult.name }))
            .setDescription(description)
            .setImage(`https://howlongtobeat.com${gameResult.imageUrl}`)
            .setColor(Constants.HOW_LONG_TO_BEAT_COLOR)
        )
      }
    } catch (e) {
      throw new CommandError(t('commands:howlongtobeat.invalidGame'), true)
    }
  }
}
