const { Command, CommandError, SwitchbladeEmbed } = require('../../')

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
      throw new CommandError(
        t('commands:studioghibli.subcommands.species.notFound')
      )
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

      embed.addField(
        t('commands:studioghibli.subcommands.species.name'),
        speciesData.name,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.species.classificaation'),
        speciesData.classification,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.species.eyecolors'),
        speciesData.eye_colors,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.species.haircolors'),
        speciesData.hair_colors,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.species.peoplelist'),
        peopleList.join(', '),
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.species.filmslist'),
        filmsList.join(', '),
        false
      )
    }

    embed.setDescription(t('commands:studioghibli.species'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
