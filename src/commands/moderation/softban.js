const { Command, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Softban extends Command {
  constructor (client) {
    super(client, {
      name: 'softban',
      aliases: ['softbanir'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['BAN_MEMBERS'], permissions: ['BAN_MEMBERS'] },
      parameters: [{
        type: 'member', acceptBot: true, missingError: 'commands:softban.missingUser'
      }, {
        type: 'string', full: true, missingError: 'commands:softban.missingReason'
      }]
    })
  }

  async run ({ channel, guild, author, t }, member, reason) {
    const embed = new SwitchbladeEmbed(author)
    await guild.ban(member, { days: 7, reason }).then(async bannedMember => {
      await guild.unban(bannedMember).then(softbannedMember => {
        embed
          .setTitle(t('commands:softban.successTitle'))
          .setDescription(`${softbannedMember} - \`${reason}\``)
      })
    }).catch(err => {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:softban.cantSoftban'))
        .setDescription(`\`${err}\``)
    })
    channel.send(embed)
  }
}
