const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class IsItUp extends Command {
  constructor (client) {
    super(client)
    this.name = 'isitup'
    this.parameters = new CommandParameters(this, new StringParameter({ missingError: 'commands:isitup.noWebsite'}))
  }

  async run ({t, author, channel}, link) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const site = encodeURIComponent(link)
    const { body } = await snekfetch.get(`https://isitup.org/${site}.json`)
    if (body.response_code) {
      embed.setTitle(t('commands:isitup.isUp', {body}))
        .setDescription(t('commands:isitup.details', {body}))
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:isitup.isDown', {body}))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
