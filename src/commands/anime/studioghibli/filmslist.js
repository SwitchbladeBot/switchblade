const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class FilmsList extends Command {
  constructor (client) {
    super(client, {
      name: 'filmslist',
      parentCommand: 'studioghibli'
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://ghibliapi.herokuapp.com/films').then(
      res => res.json()
    )
    const names = []
    body.forEach(element => {
      names.push(element.title)
    })

    embed.setImage(names.join(', ').toString('utf8'))
    embed.setDescription(t('commands:studioghibli.filmslist'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
