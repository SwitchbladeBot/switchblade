const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const moment = require('moment')

module.exports = class Twitch extends Command {
  constructor (client) {
    super(client)

    this.name = 'twitch'
    this.aliases = ['twitchchannel']
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:twitch.noChannel' })
    )
  }

  async run ({ t, author, channel, guildDocument }, twitch) {
    moment.locale(guildDocument.language)
    const { stream } = await this.client.apis.twitch.getStreamByUsername(twitch)
    const user = await this.client.apis.twitch.getUser(twitch)
    const embed = new SwitchbladeEmbed(author)
    embed
      .setTitle(user.display_name)
      .setURL(`https://twitch.tv/${user.name}`)
      .setThumbnail(user.logo)
      .addField(t('commands:twitch.bio'), user.bio)
      .addField(t('commands:twitch.createdAt'), moment(user.created_at).format('LLL'))
    channel.send(embed)
  }
}
