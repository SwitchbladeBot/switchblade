const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Cat extends Command {
  constructor (client) {
    super(client)
    this.name = 'cat'
    this.aliases = ['catto', 'kitty']
    this.category = 'general'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('http://aws.random.cat/meow')
    embed.setImage(body.file)
      .setDescription(t('commands:cat.hereIsYourCat'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
