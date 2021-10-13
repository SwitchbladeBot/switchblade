const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class flightradar24 extends Command {
  constructor (client) {
    super({
      name: 'flightradar24',
      category: 'general',
      requirements: {
        apis: ['flightradar']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:searchplate.notFound'
      }]
    }, client)
  }

  async run ({ t, author, channel, message }, flightNum) {
    try {
      const { data } = await this.client.apis.flightradar.searchAircraft(flightNum)
      const embed = new SwitchbladeEmbed()
        .setTitle(`${data.identification.callsign} - ${data.aircraft.registration} - ${data.aircraft.model.text}`)
        .setURL(`https://fr24.com/${data.identification.id}`)
        .setDescription(`**${t('commands:flightradar24.airline')}:** ${data.airline.name}`)
        .setThumbnail(data.airline.code ? `https://images.flightradar24.com/assets/airlines/logotypes/${data.airline.code.iata}_${data.airline.code.icao}.png` : 'https://i.imgur.com/qlPnbh2.png')
        .setColor(data.status.live ? Constants.GUILD_ADDED_COLOR : Constants.IDLE_AIRCRAFT_COLOR)
        .setTimestamp(null)
      if (data.status.live === true && data.airport.origin) {
        embed.addField(t('commands:flightradar24.origin'), `**${t('commands:flightradar24.departed')} <t:${data.firstTimestamp}:R>**\n[${data.airport.origin.name}](${data.airport.origin.website}) (${data.airport.origin.code.iata}/${data.airport.origin.code.icao})\n**${t('commands:flightradar24:locatedAt')}:** ${data.airport.origin.position.region.city} - ${data.airport.origin.position.country.name} (${data.airport.origin.timezone.offsetHours})`, true)
      }
      if (data.status.live === true && data.airport.destination) {
        embed.addField(t('commands:flightradar24.destination'), `**${t('commands:flightradar24.expectedArrival')} <t:${data.status.generic.eventTime.utc}:R>**\n[${data.airport.destination.name}](${data.airport.destination.website}) (${data.airport.destination.code.iata}/${data.airport.destination.code.icao})\n**${t('commands:flightradar24:locatedAt')}:** ${data.airport.destination.position.region.city} - ${data.airport.destination.position.country.name} (${data.airport.destination.timezone.offsetHours})`, true)
      }
      embed.setImage(data.aircraft.images.large[0].src)
        .setFooter(`${t('commands:flightradar24.dataBy')} Flightradar24 | ${t('commands:flightradar24.photoBy')} ${data.aircraft.images.large[0].source} | ${t('commands:flightradar24.copyright')} ${data.aircraft.images.large[0].copyright}`)
      channel.send(embed)
    } catch (e) {
      console.log(e)
      throw new CommandError('erro')
    }
  }
}
