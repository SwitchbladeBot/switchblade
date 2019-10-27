const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Species extends Command {
  constructor (client) {
    super(client, {
      name: 'species',
      parentCommand: 'studioghibli'
    })
  }

  async run ({ t, author, channel }, searchTerm) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://ghibliapi.herokuapp.com/species').then(
      res => res.json()
    )
    const speciesData = body.filter(element => element.title === searchTerm)[0]

    if (speciesData === 'undefined') {
      embed.setImage(t('commands:studioghibli.species.notFound'))
    } else {
      const peopleList = []
      for (const character of speciesData.people) {
        const body = await fetch(character).then(res => res.json())
        peopleList.push(body[0].name)
      }

      const filmsList = []
      for (const film of speciesData.films) {
        const body = await fetch(film).then(res => res.json())
        filmsList.push(body[0].title)
      }

      embed.addField('Name:', speciesData.name, false)
      embed.addField('Classification:', speciesData.classification, false)
      embed.addField('Eye Colors:', speciesData.eye_colors, false)
      embed.addField('Hair Colors:', speciesData.hair_colors, false)
      embed.addField('People:', peopleList.join(', '), false)
      embed.addField('Films:', filmsList.join(', '), false)
    }

    embed.setDescription(t('commands:studioghibli.species'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
