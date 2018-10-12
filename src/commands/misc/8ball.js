const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class EightBall extends Command {
  constructor (client) {
    super(client)
    this.name = '8ball'
    this.aliases = ['eightball', '8b', 'magicball', '8-ball']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:8ball.noQuestion' })
    )
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
