const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

const moment = require('moment-timezone')

module.exports = class Time extends Command {
  constructor (client) {
    super(client)
    this.name = 'time'
    this.aliases = ['currenttime']
    this.category = 'general'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:time.invalidTimezone' })
    )
  }

  async run ({ t, author, channel, language }, address) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    moment.locale(language)

    const place = await this.client.apis.gmaps.searchPlace(address, language)
    if (!place) {
      throw new CommandError(t('commands:time.notFound'))
    }

    const { lat, lng } = place.geometry.location
    const { timeZoneName, timeZoneId } = await this.client.apis.gmaps.getTimezone(lat, lng)
    const time = moment.tz(timeZoneId).format('LLLL (z)')

    embed
      .setTitle(t('commands:time.currentTime', { timezone: place.formatted_address }))
      .setDescription(time)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
