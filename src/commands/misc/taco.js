const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Taco extends Command {
  constructor (client) {
    super(client, {
      name: 'taco'
    })
  }

  async run ({ t, author, channel }) {
    this.log(taco)
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch(
      'http://taco-randomizer.herokuapp.com/random'
    ).then(res => res.json())
    const randomTaco = `${body.base_layer.name} with ${body.mixin.name} garnished with ${body.seasoning.name} and topped of with ${body.condiment.name} with and wrapped in ${body.shell.name}`
    embed.setImage(randomTaco.toString('utf8'))
    embed.setDescription(t('commands:taco.randomTaco'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
