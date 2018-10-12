const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const Owoify = require('../../utils/Owoify')

module.exports = class OwO extends Command {
  constructor (client) {
    super(client)
    this.name = 'owo'
    this.aliases = ['uwu', 'whatsthis', 'owoify']
    this.category = 'memes'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:owo.missingSentence' })
    )
  }

  async run ({ author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setTitle(Owoify(text))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
