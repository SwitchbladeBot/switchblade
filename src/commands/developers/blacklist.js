const { Command, BlacklistUtils, SwitchbladeEmbed } = require('../../')

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
    const doc = await this.client.database.users.get(user.id)
    await BlacklistUtils.addUser(doc, reason, author)
    embed
      .setTitle(t('commands:blacklist.successTitle'))
      .setDescription(`${user} - \`${reason}\``)
    channel.send(embed)
  }
}
