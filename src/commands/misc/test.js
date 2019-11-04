const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Shiba extends Command {
  constructor (client) {
    super(client, {
      name: 'test'
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription('[test](https://google.com "zap zop")')
    channel.send(embed)
  }
}
