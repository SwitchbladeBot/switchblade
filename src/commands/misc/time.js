const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const moment = require('moment-timezone')

module.exports = class Time extends Command {
  constructor (client) {
    super({
      name: 'time',
      aliases: ['currenttime'],
      requirements: { apis: ['positionstack'] },
      parameters: [{
        type: 'string', full: true, missingError: 'commands:time.noZone'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, address) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    moment.locale(language)

    const place = await this.client.apis.positionstack.getAddress(address)
    if (!place.data[0]) {
      throw new CommandError(t('commands:time.notFound'))
    }

    const { name } = place.data[0].timezone_module
    const time = moment.tz(name).format('LLLL (z)')

    embed
      .setTitle(t('commands:time.currentTime', { timezone: place.data[0].label }))
      .setDescription(time)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
