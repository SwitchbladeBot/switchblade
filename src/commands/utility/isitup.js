const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')

const PROTOCOL_REGEX = /^[a-zA-Z]+:\/\//
const PATH_REGEX = /(\/(.+)?)/g

module.exports = class IsItUp extends Command {
  constructor (client) {
    super({
      name: 'isitup',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:isitup.noWebsite'
      }]
    }, client)
  }

  async run ({ t, author, channel }, url) {
    url = url.replace(PROTOCOL_REGEX, '').replace(PATH_REGEX, '')
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch(`https://isitup.org/${url}.json`).then(res => res.json())
    if (body.response_code) {
      body.response_time *= 1000
      embed.setTitle(t('commands:isitup.isUp'))
        .setDescription(t('commands:isitup.details', { body }))
    } else {
      throw new CommandError(t('commands:isitup.isDown'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
