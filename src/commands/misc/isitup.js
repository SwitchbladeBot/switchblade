const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')
const regex = new RegExp('^(http|https)://')

module.exports = class IsItUp extends Command {
  constructor (client) {
    super(client)
    this.name = 'isitup'
    this.parameters = new CommandParameters(this, new StringParameter({ missingError: 'commands:isitup.noWebsite' }))
  }

  async run ({t, author, channel}, url) {
    const embed = new SwitchbladeEmbed(author)
    if (!url.match(regex)) {
      url = `http://${url}`.toLowerCase()
    }
    channel.startTyping()
    const { statusCode } = await snekfetch.get(url)
    if (this.between(statusCode, 100, 308)) {
      embed.setTitle(t('commands:isitup.isUp', { url, statusCode }))
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:isitup.isDown', { url, statusCode }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }

  between (x, min, max) {
    return x >= min && x <= max
  }
}
