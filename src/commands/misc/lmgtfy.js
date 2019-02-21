const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class LMGTFY extends Command {
  constructor (client) {
    super(client, {
      name: 'lmgtfy',
      aliases: ['letmegooglethatforyou'],
      category: 'memes',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:lmgtfy.noQuery'
      }]
    })
  }

  run ({ t, channel, author }, query) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription(t('commands:lmgtfy.search', { link: `https://lmgtfy.com/?q=${encodeURIComponent(query)}` }))
    channel.send(embed.setColor('#4285F4'))
  }
}
