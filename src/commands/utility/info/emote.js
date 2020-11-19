const { Command, SwitchbladeEmbed } = require('../../../')
const moment = require('moment')

module.exports = class InfoEmoji extends Command {
  constructor (client) {
    super({
      name: 'emoji',
      parent: 'info',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_EMOJIS'] },
      parameters: [{
        type: 'emoji',
        missingError: 'commands:info.subcommands.emote.missingEmoji'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, emoji) {
    moment.locale(language)
    const emojiAuthor = await emoji.fetchAuthor()
    const embed = new SwitchbladeEmbed(author)
      .setTitle(`${emoji.animated ? `${t('commands:info.subcommands.emoji.animatedTag')} ` : ''}${emoji.name}`)
      .setDescription(`
        **${t('commands:guildinfo.createdAt')}**: ${moment(emoji.createdAt).format('LLL')}\n(${moment(emoji.createdAt).fromNow()})
        **ID**: \`${emoji.id}\` \`\`${emoji.toString()}\`\`
        ${emojiAuthor ? `**${t('commands:info.subcommands.emoji.whoAdded')}**: ${emojiAuthor.tag}` : ''}
        `)
      .setImage(emoji.url)

    channel.send(embed)
  }
}
