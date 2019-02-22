const { Command, SwitchbladeEmbed } = require('../../')

const snekfetch = require('snekfetch')

module.exports = class Slap extends Command {
  constructor (client) {
    super(client, {
      name: 'slap',
      category: 'actions',
      parameters: [{
        type: 'user', acceptBot: true, acceptSelf: false, missingError: 'commands:slap.noMention'
      }]
    })
  }

  async run ({ t, channel, author }, user) {
    const { body } = await snekfetch.get('https://nekos.life/api/v2/img/slap')
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(body.url)
      .setDescription(t('commands:slap.success', { _author: author, slapped: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
