const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class BlacklistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'blacklist',
      category: 'developers',
      hidden: true,
      requirements: { devOnly: true },
      parameters: [{
        type: 'user', acceptDeveloper: false, missingError: 'commands:blacklist.missingUser'
      }, {
        type: 'string', full: true, missingError: 'commands:blacklist.missingReason'
      }]
    })
  }

  async run ({ channel, author, t }, user, reason) {
    const embed = new SwitchbladeEmbed(author)
    await this.client.modules.developer.blacklist(user.id, reason, author.id)
    embed
      .setTitle(t('commands:blacklist.successTitle'))
      .setDescription(`${user} - \`${reason}\``)
    channel.send(embed)
  }
}
