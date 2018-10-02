const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class NumberFacts extends Command {
  constructor (client) {
    super(client)
    this.name = 'numberfacts'
    this.aliases = ['number', 'numfacts', 'numf']
  }

  async run ({ author, channel }, number) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get(`http://numbersapi.com/${number}/trivia`)
    embed.setTitle(body)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
