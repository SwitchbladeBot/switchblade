const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class InspiroBot extends Command {
  constructor (client) {
    super(client, {
      name: 'inspirobot',
      aliases: ['inspiro', 'ibot']
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('http://inspirobot.me/api?generate=true').then(res => res.json())
    embed
      .setImage(body.toString('utf8'))
      .setDescription(t('commands:inspirobot.quote'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
