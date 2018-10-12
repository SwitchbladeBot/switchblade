const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class XKCD37 extends Command {
  constructor (client) {
    super(client)
    this.name = 'xkcd37'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'errors:noSentence' })
    )
  }

  // Context: https://xkcd.com/37/

  async run ({ author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    embed.setTitle(text.replace(/(\w+?)(?!\\)+(-ass)(\s+)(\S+?)/g, '$1$3ass-$4').replace(/\\-/g, '-'))
    channel.send(embed)
  }
}
