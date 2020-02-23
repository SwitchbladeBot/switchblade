const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Unblacklist extends Command {
  constructor (client) {
    super({
      name: 'unblacklist',
      category: 'developers',
      hidden: true,
      requirements: { devOnly: true },
      parameters: [{
        type: 'user', showUsage: false, missingError: 'commands:unblacklist.missingUser'
      }]
    }, client)
  }

  async run ({ channel, author, t }, user) {
    const embed = new SwitchbladeEmbed(author)
    await this.client.controllers.developer.unblacklist(user.id)
    embed.setDescription(`**${t('commands:unblacklist.success', { user })}**`)
    channel.send(embed)
  }
}
