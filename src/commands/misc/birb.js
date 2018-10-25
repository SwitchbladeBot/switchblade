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
    const { body } = await snekfetch.get('http://random.birb.pw/tweet.json/')
    embed.setImage('http://random.birb.pw/img/' + body.file)
      .setDescription(t('commands:birb.hereIsYourBirb'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
