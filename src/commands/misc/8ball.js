const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class EightBall extends Command {
  constructor (client) {
    super(client, {
      name: '8ball',
      aliases: ['eightball', '8b', 'magicball', '8-ball'],
      parameters: [{
        type: 'string', full: true, missingError: 'commands:8ball.noQuestion'
      }]
    })
  }

  run ({ t, author, channel }, question) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const answerCount = 19
    const result = Math.floor((Math.random() * answerCount))
    embed.setColor(Constants.EIGHTBALL_COLOR)
      .setDescription(`:grey_question: ${question}\n:8ball: ${t(`commands:8ball.answers.${result}`)}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
