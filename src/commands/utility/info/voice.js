const { Command, SwitchbladeEmbed, CommandError } = require('../../../')
const moment = require('moment')

module.exports = class InfoVoice extends Command {
  constructor (client) {
    super({
      name: 'voice',
      parent: 'info',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'channel',
        acceptVoice: true,
        required: true,
        full: true,
        missingError: 'commands:info.subcommands.voice.missingChannelName'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, givenChannel) {
    moment.locale(language)
    if (!givenChannel) {
      throw new CommandError(t('errors:channelDoesntExist'))
    }

    const embed = new SwitchbladeEmbed(author)
      .setTitle(givenChannel.name)
      .setDescription(
        `${givenChannel.parent ? `**${t('commands:info.subcommands.channel.category')}**: ${givenChannel.parent.name}` : ''}
        ${t('commands:guildinfo.createdAt')}: ${moment(givenChannel.createdAt).format('LLL')}\n(${moment(givenChannel.createdAt).fromNow()})
        **ID**: \`${givenChannel.id}\`
        **${t('commands:info.subcommands.voice.bitrate')}**: ${givenChannel.bitrate / 1000}kbps
        **${t('commands:info.subcommands.voice.userLimit')}**: ${givenChannel.members.size}/${givenChannel.userLimit}`)

    channel.send(embed)
  }
}
