const { Command, SwitchbladeEmbed } = require('../../../')
const moment = require('moment')

module.exports = class InfoChannel extends Command {
  constructor (client) {
    super({
      name: 'channel',
      parent: 'info',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'channel',
        required: true,
        acceptText: true,
        acceptNews: true,
        acceptStore: true,
        onlySameGuild: true,
        missingError: 'commands:info.subcommands.category.missingCategoryMention'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, givenChannel) {
    moment.locale(language)
    const embed = new SwitchbladeEmbed(author)
      .setTitle(`${givenChannel.nsfw ? `${t('commands:info.subcommands.channel.nsfwTag')} ` : ''}${givenChannel.name}`)
      .setDescription(
        `${givenChannel.parent ? `**${t('commands:info.subcommands.channel.category')}**: ${givenChannel.parent.name}` : ''}
        **${t('commands:guildinfo.createdAt')}**: ${moment(givenChannel.createdAt).format('LLL')}\n(${moment(givenChannel.createdAt).fromNow()})
        **ID**: \`${givenChannel.id}\` <#${givenChannel.id}>
        **${t(`commands:info.subcommands.channel.canViewThisChannel${givenChannel.members.size > 1 ? 'Plural' : ''}`, { userCount: givenChannel.members.size })}**
        ${givenChannel.topic.length > 1 ? `\n${givenChannel.topic}` : ''}`)

    channel.send(embed)
  }
}
