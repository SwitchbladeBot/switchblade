const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Hug extends Command {
  constructor (client) {
    super(client, {
      name: 'hug',
      category: 'images',
      parameters: [{
        type: 'user', acceptBot: true, acceptSelf: false, missingError: 'commands:hug.noMention'
      }]
    })
  }

  async run ({ t, channel, author }, user) {
    const body = await fetch('https://nekos.life/api/v2/img/hug').then(res => res.json())
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(body.url)
      .setDescription(t('commands:hug.success', { hugger: author, hugged: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
