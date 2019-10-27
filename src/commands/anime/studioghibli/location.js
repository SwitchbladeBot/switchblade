const { Command, SwitchbladeEmbed } = require('../../')

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
      embed.setImage(t('commands:studioghibli.location.notFound'))
    } else {
      const filmData = await fetch(locationData.films[0]).then(res =>
        res.json()
      )

      embed.addField('Name:', locationData.name, false)
      embed.addField('Climate:', locationData.climate, false)
      embed.addField('Terrain:', locationData.terrain, false)
      embed.addField('Film:', filmData.title, false)
    }

    embed.setDescription(t('commands:studioghibli.location'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
