const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class GeekJokes extends Command {
  constructor (client) {
    super(client)
    this.name = 'geekjokes'
    this.aliases = ['geek', 'geekjoke', 'geekj']
  }

  async run ({ author, channel }, number) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('https://geek-jokes.sameerkumar.website/api')
    embed.setTitle(body)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
