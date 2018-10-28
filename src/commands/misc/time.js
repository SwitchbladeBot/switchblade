const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const moment = require('moment-timezone')

// Create a map of tz abbreviations to locations
// { PDT: [ 'America/Dawson', 'America/Ensenada', 'America/Los_Angeles', ... ], ... }
const mappedZones = moment.tz.names()
  .reduce((zones, tzName) => {
    const abbr = moment.tz(tzName).format('z')

    if (zones[abbr] && zones[abbr] instanceof Array) {
      zones[abbr].push(tzName)
    } else {
      zones[abbr] = [ tzName ]
    }

    return zones
  }, {})

module.exports = class Time extends Command {
  constructor (client) {
    super(client)
    this.name = 'time'
    this.aliases = ['currenttime']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:time.invalidTimezone' })
    )
  }

  run ({ t, author, channel }, requestedTz) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    let reqTz = requestedTz

    if (mappedZones[reqTz]) {
      reqTz = mappedZones[reqTz][0]
    }

    let time
    if (!moment.tz.zone(reqTz)) {
      time = t('commands:time.invalidTimezone')
    } else {
      time = moment.tz(reqTz).format('D MMM hh:mma z')
    }

    embed
      .setTitle(t('commands:time.currentTime', { timezone: requestedTz }))
      .setDescription(time)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
