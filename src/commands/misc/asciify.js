const { CommandStructures } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const figlet = require('figlet')

module.exports = class Asciify extends Command {
  constructor (client) {
    super(client)
    this.name = 'asciify'
    this.aliases = ['bigtext']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:asciify.noText' })
    )
  }

  run ({ channel }, text) {
    const bigtext = figlet.textSync(text, {
      font: 'Big',
      horizontalLayout: 'universal smushing',
      verticalLayout: 'universal smushing'
    })
    channel.send(`\`\`\`${bigtext}\`\`\``)
  }
}
