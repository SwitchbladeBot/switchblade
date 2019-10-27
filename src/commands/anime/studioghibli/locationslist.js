const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class LocationsList extends Command {
  constructor (client) {
    super(client, {
      name: 'locationslist',
      parentCommand: 'studioghibli'
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://ghibliapi.herokuapp.com/locations').then(
      res => res.json()
    )
    const names = []
    body.forEach(element => {
      names.push(element.name)
    })

    embed.setImage(names.join(', ').toString('utf8'))
    embed.setDescription(t('commands:studioghibli.locationslist'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
