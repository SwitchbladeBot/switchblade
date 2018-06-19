const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class LetMeGoogleThatForYou extends Command {
  constructor (client) {
    super(client)
    this.name = 'lmgtfy'

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:lmgtfy.noQuery'})
    )
  }

  run ({ t, channel, author }, query) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (query.includes('--explain')) {
      embed.setDescription(t('commands:lmgtfy.search', { query: query.replace('--explain', ''), link: `https://lmgtfy.com/?iie=1&q=${encodeURIComponent(query.replace('--explain', ''))}` }))
    } else {
      embed.setDescription(t('commands:lmgtfy.search', { query, link: `https://lmgtfy.com/?q=${encodeURIComponent(query)}` }))
    }
    channel.send(embed.setColor(Constants.GOOGLE_COLOR)).then(() => channel.stopTyping())
  }
}
