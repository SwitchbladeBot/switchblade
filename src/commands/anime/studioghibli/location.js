const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Location extends Command {
  constructor (client) {
    super(client, {
      name: 'location',
      parentCommand: 'studioghibli'
    })
  }

  async run ({ t, author, channel }, searchTerm) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://ghibliapi.herokuapp.com/locations').then(
      res => res.json()
    )
    const locationData = body.filter(element => element.name === searchTerm)[0]

    if (locationData === 'undefined') {
      throw new CommandError(
        t('commands:studioghibli.subcommands.location.notFound')
      )
    } else {
      const filmData = await fetch(locationData.films[0]).then(res =>
        res.json()
      )

      embed.addField(
        t('commands:studioghibli.subcommands.location.name'),
        locationData.name,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.location.climate'),
        locationData.climate,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.location.terrain'),
        locationData.terrain,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.location.title'),
        filmData.title,
        false
      )
    }

    embed.setDescription(t('commands:studioghibli.location'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
