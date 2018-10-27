const { CommandStructures } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Vaporwave extends Command {
  constructor (client) {
    super(client)
    this.name = 'vaporwave'
    this.category = 'memes'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:vaporwave.missingSentence' })
    )
  }

  async run ({ t, author, channel }, text) {
    const vaporwavefied = text.split('').map(char => {
      const code = char.charCodeAt(0)
      return code >= 33 && code <= 126 ? String.fromCharCode((code - 33) + 65281) : char
    }).join('')
    channel.send(vaporwavefied)
  }
}
