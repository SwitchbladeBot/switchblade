const { Command, SwitchbladeEmbed, MiscUtils } = require('../../')
const moment = require('moment')
const Color = require('../../utils/Color.js')

module.exports = class RoleInfo extends Command {
  constructor (client) {
    super({
      name: 'roleinfo',
      aliases: ['rolinfo', 'rol', 'ri', 'roli'],
      category: 'utility',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'role',
        full: true,
        missingError: 'errors:invalidRole'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, role) {
    moment.locale(language)
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(role)
        .setColor(role.color || process.env.EMBED_COLOR)
        .addField(t('commands:roleinfo.id'), role.id, true)
        .addField(t('commands:roleinfo.name'), role.name, true)
        .addField(t('commands:roleinfo.mention'), `\`${role}\``, true)
        .addField(t('commands:roleinfo.createdAt'), `${moment(role.createdAt).format('LLL')}\n(${moment(role.createdAt).fromNow()})`, true)
        .addField(t('commands:roleinfo.members'), `**${MiscUtils.formatNumber(role.members.size, language)}** (${t('commands:roleinfo.online', { count: MiscUtils.formatNumber(role.members.filter(m => m.user.presence.status !== 'offline').size, language) })})`, true)
        .addField(t('commands:roleinfo.position'), MiscUtils.formatNumber(role.position, language), true)
        .addField(t('commands:roleinfo.mentionable'), role.mentionable ? t('commands:roleinfo.yes') : t('commands:roleinfo.no'), true)
        .addField(t('commands:roleinfo.hoisted'), role.hoist ? t('commands:roleinfo.yes') : t('commands:roleinfo.no'), true)
        .addField(t('commands:roleinfo.color'), `\`${role.hexColor}\`\n${new Color(role.hexColor).rgb()}`, true)
    )
  }
}
