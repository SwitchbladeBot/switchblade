const { Command, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Ban extends Command {
  constructor (client) {
    super({
      name: 'ban',
      aliases: ['banir'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['BAN_MEMBERS'], permissions: ['BAN_MEMBERS'] },
      parameters: [{
        type: 'member', acceptBot: true, missingError: 'commands:ban.missingUser'
      }, {
        type: 'string', full: true, missingError: 'commands:ban.missingReason'
      }]
    }, client)
  }

  async run ({ channel, guild, author, t }, member, reason) {
    const embed = new SwitchbladeEmbed(author)
    await member.ban({ days: 7, reason }).then(bannedMember => {
      embed
        .setTitle(t('commands:ban.successTitle'))
        .setDescription(`${bannedMember} - \`${reason}\``)
    }).catch(err => {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:ban.cantBan'))
        .setDescription(`\`${err}\``)
    })
    channel.send(embed)
  }
}
