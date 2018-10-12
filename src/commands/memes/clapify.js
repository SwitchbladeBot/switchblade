const { CommandStructures, SwitchbladeEmbed } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures

const emoji = '\uD83D\uDC4F'

module.exports = class Clapify extends Command {
  constructor (client) {
    super(client)
    this.name = 'clapify'
    this.category = 'memes'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:clapify.missingSentence' })
    )
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    embed.setTitle(`${emoji} ${text.toUpperCase().split(' ').join(` ${emoji} `)} ${emoji}`)
    channel.send(embed)
  }
}
