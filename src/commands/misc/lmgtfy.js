const { CommandStructures } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class LetMeGoogleThatForYou extends Command {
  constructor (client) {
    super(client)
    this.name = 'lmgtfy'

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:lmgtfy.noQuestion'})
    )
  }

  run ({ t, channel }, question) {
    channel.startTyping()
    channel.send(`https://lmgtfy.com/?q=${encodeURIComponent(question)}`).then(() => channel.stopTyping())
  }
}
