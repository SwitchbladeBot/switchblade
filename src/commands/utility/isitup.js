const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')

const PROTOCOL_REGEX = /^[a-zA-Z]+:\/\//
const PATH_REGEX = /(\/(.+)?)/g

module.exports = class IsItUp extends Command {
  constructor (client) {
    super(client)
    this.name = 'isitup'
    this.category = 'utility'
    this.parameters = new CommandParameters(this, new StringParameter({ full: true, missingError: 'commands:isitup.noWebsite' }))
  }

  async run ({ t, author, channel }, url) {
    url = url.replace(PROTOCOL_REGEX, '').replace(PATH_REGEX, '')
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get(`https://isitup.org/${url}.json`)
    if (body.response_code) {
      body.response_time *= 1000
      embed.setTitle(t('commands:isitup.isUp'))
        .setDescription(t('commands:isitup.details', { body }))
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:isitup.isDown'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
