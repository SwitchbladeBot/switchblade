const { Command, CommandError, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Film extends Command {
  constructor (client) {
    super(client, {
      name: 'film',
      parentCommand: 'studioghibli'
    })
  }

  async run ({ t, author, channel }, searchTerm) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://ghibliapi.herokuapp.com/films').then(
      res => res.json()
    )
    const filmData = body.filter(element => element.title === searchTerm)[0]

    if (filmData === 'undefined') {
      throw new CommandError(
        t('commands:studioghibli.subcommands.film.notFound')
      )
    } else {
      embed.addField(
        t('commands:studioghibli.subcommands.film.name'),
        filmData.title,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.film.releasedate'),
        filmData.release_date,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.film.director'),
        filmData.director,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.film.producer'),
        filmData.producer,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.film.rtscore'),
        filmData.rt_score,
        false
      )
      embed.addField(
        t('commands:studioghibli.subcommands.film.description'),
        filmData.description,
        false
      )
    }

    embed.setDescription(t('commands:studioghibli.film'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
