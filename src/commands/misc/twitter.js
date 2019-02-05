const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter, ChannelParameter, CommandRequirements, CommandError } = CommandStructures

module.exports = class Twitter extends Command {
  constructor (client) {
    super(client)
    this.name = 'twitter'
    this.category = 'misc'

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD'], apis: ['twitter'] })

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: false, missingError: 'commands:twitter.noUser' }),
      new ChannelParameter({ full: true, missingError: 'commands:twitter.noChannel' })
    )
  }

  async run ({ t, channel, author, guild }, user, postChannel) {
    const twitterUser = await this.client.apis.twitter.getUser(user)
    if (twitterUser) {
      channel.startTyping()
      try {
        await this.client.modules.configuration.setTwitter(guild.id, twitterUser.id_str, postChannel.id)
        channel.send(
          new SwitchbladeEmbed(author)
            .setAuthor('Twitter', 'https://i.imgur.com/PrxKg1P.png')
            .setColor(Constants.TWITTER_COLOR)
            .setTitle('Twitter configured!')
            .setDescription(`**@${twitterUser.screen_name}**'s tweets will now be posted at ${postChannel}.`)
        ).then(() => channel.stopTyping())
      } catch (err) {
        throw new CommandError(t('errors:generic'))
      }
    } else throw new CommandError(t('commands:twitter.userNotFound'))
  }
}
