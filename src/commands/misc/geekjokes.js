const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')

module.exports = class GeekJokes extends Command {
  constructor (client) {
    super(client, {
      name: 'geekjokes',
      aliases: ['geek', 'geekjoke', 'geekj']
    })
  }

  async run ({ author, channel }, number) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('https://geek-jokes.sameerkumar.website/api').then(res => res.json())
    embed.setTitle(body)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
