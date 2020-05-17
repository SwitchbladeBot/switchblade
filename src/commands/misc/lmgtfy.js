const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class LMGTFY extends Command {
  constructor (client) {
    super({
      name: 'lmgtfy',
      aliases: ['letmegooglethatforyou'],
      category: 'memes',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:lmgtfy.noQuery'
      }]
    }, client)
  }

  run ({ t, channel, author }, query) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription(t('commands:lmgtfy.search', { link: `https://lmgtfy.com/?q=${encodeURIComponent(query)}` }))
    channel.send(embed.setColor('#4285F4'))
  }
}
