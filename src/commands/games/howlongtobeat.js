const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const hltb = require('howlongtobeat')
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
            missingError: 'commands:howlongtobeat.noGame'
          }
        ]
      },
      client
    )
  }

  async run ({ t, author, channel, guild }, game) {
    try {
      hltbService.search(game).then((result) => {
        if (result.length === 0) {
          throw new CommandError(t('commands:howlongtobeat.invalidGame'), true)
        } else {
          const gameResult = result[0]
          let description = ''
          gameResult.timeLabels.forEach(timeLabel => {
            description += `${timeLabel[1]} : ${gameResult[timeLabel[0]]} hrs\n`
          })

          const embed = new SwitchbladeEmbed(author)
          embed
            .setTitle(t('commands:howlongtobeat.title', { game: game }))
            .setDescription(description)
            .setImage(`https://howlongtobeat.com${gameResult.imageUrl}`)
            .setColor('#91A1F4')

          channel.send(embed).then(() => channel.stopTyping())
        }
      })
    } catch (e) {
      throw new CommandError(t('commands:howlongtobeat.invalidGame'), true)
    }
  }
}
