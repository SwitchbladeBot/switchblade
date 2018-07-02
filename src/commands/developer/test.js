const { CommandStructures } = require('../../')
const { Command, CommandParameters, UserParameter, StringParameter } = CommandStructures

module.exports = class Test extends Command {
  constructor (client) {
    super(client)
    this.name = 'test'

    this.subcommands = [
      new TestAdd(client)
    ]

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true}),
      [
        new StringParameter({name: 'message', full: true}),
        new StringParameter({name: 'text', full: true})
      ]
    )
  }

  run ({ channel, flags }, user) {
    channel.send(`Username: ${user.username}\nMessage: ${flags.message}\nText: ${flags.text}`)
  }
}

class TestAdd extends Command {
  constructor (client) {
    super(client)
    this.name = 'discriminator'
    this.aliases = ['discrim']

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true})
    )
  }

  run ({ channel }, user) {
    channel.send(`Discriminator: ${user.discriminator}`)
  }
}
