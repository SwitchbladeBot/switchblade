const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Character extends Command {
  constructor (client) {
    super(client, {
      name: 'character',
      parentCommand: 'studioghibli'
    })
  }

  async run ({ t, author, channel }, searchTerm) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://ghibliapi.herokuapp.com/people').then(
      res => res.json()
    )
    const characterData = body.filter(
      element => element.name === searchTerm
    )[0]

    if (characterData === 'undefined') {
      throw new CommandError(
        t('commands:studioghibli.subcommands.character.notFound')
      )
    } else {
      const speciesData = await fetch(characterData.species).then(res =>
        res.json()
      )

      const filmData = await fetch(characterData.films[0]).then(res =>
        res.json()
      )

      embed.addField(
        t('commands:studioghibli.subcommands.character.name'),
        characterData.name,
        false
      )
      embed.addField(
        'commands:studioghibli.subcommands.character.gender',
        characterData.gender,
        false
      )
      embed.addField(
        'commands:studioghibli.subcommands.character.eyecolor',
        characterData.eye_color,
        false
      )
      embed.addField(
        'commands:studioghibli.subcommands.character.haircolor',
        characterData.hair_color,
        false
      )
      embed.addField(
        'commands:studioghibli.subcommands.character.speciesname',
        speciesData.name,
        false
      )
      embed.addField(
        'commands:studioghibli.subcommands.character.filmtitle',
        filmData.title,
        false
      )
    }

    embed.setDescription(t('commands:studioghibli.character'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
