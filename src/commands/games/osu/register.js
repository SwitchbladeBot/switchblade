const { Command, SwitchbladeEmbed, CommandError } = require('../../../')
const moment = require('moment')

module.exports = class OsuRegister extends Command {
  constructor (client) {
    super(client, {
      name: 'register',
      aliases: ['reg', 'r'],
      parentCommand: 'osu',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:osu.subcommands.player.noPlayer'
      }]
    })
  }

  async run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    try {
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
