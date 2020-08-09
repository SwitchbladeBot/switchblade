const { Command, SwitchbladeEmbed, CommandError } = require('../../../')
const moment = require('moment')

module.exports = class InfoVoice extends Command {
  constructor (client) {
    super({
      name: 'voice',
      parent: 'info',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'string',
        required: true,
        full: true,
        missingError: 'commands:info.subcommands.voice.missingChannelName'
      }]
    }, client)
  }

  async run ({ message, t, author, channel, language }, givenChannel) {
    moment.locale(language)
    givenChannel = message.guild.channels.cache
      .filter(channel => channel.type === 'voice' && channel.name.toLowerCase() === givenChannel.toLowerCase())
    givenChannel = givenChannel.first()
    if (!givenChannel) {
      throw new CommandError(t('errors:channelDoesntExist'))
    }

    const embed = new SwitchbladeEmbed(author)

      .setTitle(givenChannel.name)
      .setDescription(
        `${givenChannel.parent ? `**${t('commands:info.subcommands.channel.category')}**: ${givenChannel.parent.name}` : ''}
        ${t('commands:guildinfo.createdAt')}: ${moment(givenChannel.createdAt).format('LLL')}\n(${moment(givenChannel.createdAt).fromNow()})
        **ID**: ${givenChannel.id}
        **${t('commands:info.subcommands.voice.bitrate')}**: ${givenChannel.bitrate}
        **${t('commands:info.subcommands.voice.userLimit')}**: ${givenChannel.members.size}/${givenChannel.userLimit}`)

    channel.send(embed)
  }
}
