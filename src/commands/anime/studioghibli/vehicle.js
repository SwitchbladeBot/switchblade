const { Command, CommandError, SwitchbladeEmbed } = require('../../')

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
      throw new CommandError(
        t('commands:studioghibli.subcommands.vehicle.notFound')
      )
    } else {
      const pilotData = await fetch(vehicleData.pilot).then(res => res.json())

      const filmData = await fetch(vehicleData.films[0]).then(res =>
        res.json()
      )

      embed.addField(
        t('commands:studioghibli.subcommands.vehicle.name'),
        vehicleData.name,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.vehicle.description'),
        vehicleData.description,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.vehicle.vehicleclass'),
        vehicleData.vehicle_class,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.vehicle.length'),
        vehicleData.length,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.vehicle.pilot'),
        pilotData.name,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.vehicle.film'),
        filmData.title,
        false
      )
    }

    embed.setDescription(t('commands:studioghibli.vehicle'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
