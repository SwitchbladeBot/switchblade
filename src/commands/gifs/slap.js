const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Slap extends Command {
  constructor (client) {
    super(client, {
      name: 'slap',
      category: 'images',
      parameters: [{
        type: 'user', acceptBot: true, acceptSelf: false, missingError: 'commands:slap.noMention'
      }]
    })
  }

  async run ({ t, channel, author }, user) {
    const body = await fetch('https://nekos.life/api/v2/img/slap').then(res => res.json())
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(body.url)
      .setDescription(t('commands:slap.success', { _author: author, slapped: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
