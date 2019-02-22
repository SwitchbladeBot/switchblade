const { Command, SwitchbladeEmbed } = require('../../')

const snekfetch = require('snekfetch')

module.exports = class Pat extends Command {
  constructor (client) {
    super(client, {
      name: 'pat',
      category: 'actions',
      parameters: [{
        type: 'user', acceptBot: true, acceptSelf: false, missingError: 'commands:pat.noMention'
      }]
    })
  }

  async run ({ t, channel, author }, user) {
    const { body } = await snekfetch.get('https://nekos.life/api/v2/img/pat')
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(body.url)
      .setDescription(t('commands:pat.success', { _author: author, pat: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
