const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class LMGTFY extends Command {
  constructor (client) {
    super(client)
    this.name = 'lmgtfy'
    this.aliases = ['letmegooglethatforyou']
    this.category = 'memes'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:lmgtfy.noQuery' })
    )
  }

  run ({ t, channel, author }, query) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription(t('commands:lmgtfy.search', { link: `https://lmgtfy.com/?q=${encodeURIComponent(query)}` }))
    channel.send(embed.setColor('#4285F4'))
  }
}
