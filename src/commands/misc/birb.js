const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Birb extends Command {
  constructor (client) {
    super(client)
    this.name = 'birb'
    this.category = 'misc'
    this.aliases = ['bird', 'borb']
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('https://random.birb.pw/tweet/random')
    embed.setImage(body)
      .setDescription(t('commands:birb.hereIsYourBirb'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
