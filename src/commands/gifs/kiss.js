const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Kiss extends Command {
  constructor (client) {
    super(client, {
      name: 'kiss',
      aliases: ['beijo', 'beijar'],
      category: 'images',
      parameters: [{
        type: 'user', acceptBot: true, acceptSelf: false, missingError: 'commands:kiss.noMention'
      }]
    })
  }

  async run ({ t, channel, author }, user) {
    const body = await fetch('https://nekos.life/api/v2/img/kiss').then(res => res.json())
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(body.url)
      .setDescription(t('commands:kiss.success', { kisser: author, kissed: user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
