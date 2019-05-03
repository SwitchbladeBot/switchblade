const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class OsuRegister extends Command {
  constructor (client) {
    super(client, {
      name: 'register',
      aliases: ['reg', 'r'],
      requirements: { databaseOnly: true },
      parentCommand: 'osu',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:osu.subcommands.player.noPlayer'
      }]
    })
  }

  async run ({ t, author, channel }, user) {
    channel.startTyping()
    try {
      // eslint-disable-next-line camelcase
      const { user_id, username } = await this.client.apis.osu.getUser(user, 0)
      await this.client.modules.social.setOsuId(author.id, user_id)
      channel.send(new SwitchbladeEmbed(author)
        .setDescription(t('commands:osu.subcommands.register.registered', { username }))
      ).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(t('commands:osu.subcommands.register.invalidPlayer'))
    }
  }
}
