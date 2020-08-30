const { Command, SwitchbladeEmbed, CommandError } = require('../../../')
const moment = require('moment')

module.exports = class InfoEmote extends Command {
  constructor (client) {
    super({
      name: 'emote',
      parent: 'info',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_EMOJIS'] },
      parameters: [{
        type: 'emoji',
        missingError: 'commands:info.subcommands.emote.missingEmote'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, emoji) {
    moment.locale(language)
    try {
      const emojiAuthor = await emoji.fetchAuthor()
      const embed = new SwitchbladeEmbed(author)
        .setTitle(`${emoji.animated ? `${t('commands:info.subcommands.emote.animatedTag')} ` : ''}${emoji.name}`)
        .setDescription(`
        **${t('commands:guildinfo.createdAt')}**: ${moment(emoji.createdAt).format('LLL')}\n(${moment(emoji.createdAt).fromNow()})
        **ID**: ${emoji.id} \`\`<:${emoji.name}:${emoji.id}>\`\`
        ${emojiAuthor ? `**${t('commands:info.subcommands.emote.whoAdded')}**: ${emojiAuthor.tag}` : ''}
        `)
        .setImage(emoji.url)

      channel.send(embed)
    } catch (e) {
      throw new CommandError(t('errors:needManageEmojis'))
    }
  }
}
