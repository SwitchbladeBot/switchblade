const { Command, SwitchbladeEmbed } = require('../../')

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
      embed.setImage(t('commands:studioghibli.film.notFound'))
    } else {
      embed.addField('Name:', filmData.title, false)
      embed.addField('Release Date:', filmData.release_date, false)
      embed.addField('Director:', filmData.director, false)
      embed.addField('Producter:', filmData.producter, false)
      embed.addField('Rotten Tomatoes Score:', filmData.rt_score, false)
      embed.addField('Description:', filmData.description, false)
    }

    embed.setDescription(t('commands:studioghibli.film'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
