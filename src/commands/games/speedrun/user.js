const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class SpeedrunUser extends Command {
  constructor (client) {
    super(client, {
      name: 'user',
      aliases: ['u'],
      parentCommand: 'speedrun',
      parameters: [{
        type: 'string', full: true, missingError: 'no user caralho'
      }]
    })
  }

  async run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    try {
      const { location, names, weblink } = await this.client.apis.speedrun.getUser(user)

      embed
        .setAuthor('speedrun.com', 'https://pbs.twimg.com/profile_images/500500884757831682/L0qajD-Q_reasonably_small.png', 'https://speedrun.com')
        .setDescription(`:flag_${location.country.code}: **[${names.international}${names.japanese ? `(${names.japanese})` : ''}](${weblink})**`)

      channel.send(embed)
    } catch (e) {
      throw new CommandError(e)
    }
  }
}