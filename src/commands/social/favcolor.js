const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class FavColor extends Command {
  constructor (client) {
    super(client, {
      name: 'favcolor',
      aliases: ['favoritecolor', 'sethex', 'setcolor'],
      category: 'social',
      requirements: { databaseOnly: true },
      parameters: [{
        type: 'color',
        full: true,
        missingError: 'errors:invalidColor'
      }]
    })
  }

  async run ({ t, author, channel, userDocument }, color) {
    const hexcode = color.rgb(true)
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      await this.client.modules.social.setFavoriteColor(author.id, hexcode)
      embed.setColor(hexcode)
        .setTitle(t('commands:favcolor.changedSuccessfully', { hexcode }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
