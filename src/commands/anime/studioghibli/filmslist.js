const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Taco extends Command {
  constructor (client) {
    super(client, {
      name: 'filmslist',
      parentCommand: 'studioghibli',
    })
        const body = await fetch(
          'https://ghibliapi.herokuapp.com/films'
        ).then(res => res.json())
        console.log(body);
        console.log(returnNamesList(body))
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch(
      'https://ghibliapi.herokuapp.com/films'
      ).then(res => res.json())
      names = [];
      body.forEach(element => {
        names.push(lement.title);
      });

    embed.setImage(names.join(', ').toString('utf8'))
    embed.setDescription(t('commands:studioghibli.filmslist'))
    channel.send(embed).then(() => channel.stopTyping())
  }

}

