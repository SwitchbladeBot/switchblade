const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Vehicle extends Command {
  constructor (client) {
    super(client, {
      name: 'vehicle',
      parentCommand: 'studioghibli'
    })
  }

  async run ({ t, author, channel }, searchTerm) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://ghibliapi.herokuapp.com/vehicles').then(
      res => res.json()
    )
    const vehicleData = body.filter(element => element.name === searchTerm)[0]

    if (vehicleData === 'undefined') {
      embed.setImage(t('commands:studioghibli.vehicle.notFound'))
    } else {
      const pilotData = await fetch(vehicleData.pilot).then(res => res.json())

      const filmData = await fetch(vehicleData.films[0]).then(res =>
        res.json()
      )

      embed.addField('Name:', vehicleData.title, false)
      embed.addField('Description:', vehicleData.description, false)
      embed.addField('Vehicle Class:', vehicleData.vehicle_class, false)
      embed.addField('Length:', vehicleData.length, false)
      embed.addField('Pilot:', pilotData.name, false)
      embed.addField('Films:', filmData.title, false)
    }

    embed.setDescription(t('commands:studioghibli.vehicle'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
