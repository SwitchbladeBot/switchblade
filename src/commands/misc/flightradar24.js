const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class flightradar24 extends Command {
  constructor (client) {
    super({
      name: 'flightradar24',
      category: 'utility',
      aliases: ['flightradar', 'fr24', 'fr'],
      requirements: {
        apis: ['flightradar']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:flightradar24.notFound'
      }]
    }, client)
  }

  async run ({ t, author, channel, message }, flightNum) {
    try {
      const airplaneData = await this.client.apis.flightradar.searchAircraft(flightNum)
      const embed = new SwitchbladeEmbed()
        .setTitle(`${airplaneData.identification?.callsign || t('commands:flightradar24:noCallsign')} - ${airplaneData.aircraft.registration || airplaneData.aircraft.model?.code || t('commons:notAvailable')} - ${airplaneData.aircraft.model?.text || t('commons:notAvailable')}`)
        .setURL(`https://fr24.com/${airplaneData.identification?.id}`)
        .setDescription(`**${t('commands:flightradar24.airline')}:** ${airplaneData.airline?.name || t('commons:notAvailable')}`)
        .setThumbnail(airplaneData.airline?.code ? `https://images.flightradar24.com/assets/airlines/logotypes/${airplaneData.airline.code.iata}_${airplaneData.airline.code.icao}.png` : 'https://i.imgur.com/qlPnbh2.png')
        .setColor(airplaneData.status.live ? Constants.GUILD_ADDED_COLOR : Constants.IDLE_AIRCRAFT_COLOR)
        .setTimestamp(null)
      if (airplaneData.status.live) {
        if (airplaneData.airport.origin) {
          embed.addField(`🛫 **${t('commands:flightradar24.departed')} <t:${airplaneData.firstTimestamp}:R>**`, `[${airplaneData.airport.origin.name}](${airplaneData.airport.origin.website}) (${airplaneData.airport.origin.code.iata}/${airplaneData.airport.origin.code.icao})\n**${t('commands:flightradar24:locatedIn')}:** ${airplaneData.airport.origin.position.region.city} - ${airplaneData.airport.origin.position.country.name} (${airplaneData.airport.origin.timezone.offsetHours})`, true)
        }
        if (airplaneData.airport.destination) {
          embed.addField(`🛬 **${t('commands:flightradar24.expectedArrival')} <t:${airplaneData.status.generic.eventTime?.utc || Math.floor(Date.now() / 1000)}:R>**`, `[${airplaneData.airport.destination.name}](${airplaneData.airport.destination.website}) (${airplaneData.airport.destination.code.iata}/${airplaneData.airport.destination.code.icao})\n**${t('commands:flightradar24:locatedIn')}:** ${airplaneData.airport.destination.position.region.city} - ${airplaneData.airport.destination.position.country.name} (${airplaneData.airport.destination.timezone.offsetHours})`, true)
        }
      }
      embed.setImage(airplaneData.aircraft.images?.large?.[0]?.src || airplaneData.aircraft.images?.medium?.[0]?.src || airplaneData.aircraft.images?.sideview || 'https://www.flightradar24.com/static/images/jp-promo-blocked.jpg')
        .setFooter(`${t('commands:flightradar24.dataBy')} Flightradar24 | ${t('commands:flightradar24.photoBy')} ${airplaneData.aircraft.images?.large[0]?.source || airplaneData.aircraft.images?.medium[0]?.source || t('commons:notAvailable')} | ${t('commands:flightradar24.copyright')} ${airplaneData.aircraft.images?.large[0]?.copyright || airplaneData.aircraft.images?.medium[0]?.copyright || t('commons:notAvailable')}`)
      channel.send(embed)
    } catch (e) {
      throw new CommandError(t('commands:flightradar24:notFound'))
    }
  }
}
