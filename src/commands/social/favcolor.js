const { Command, SwitchbladeEmbed, CommandError } = require('../../')

module.exports = class FavColor extends Command {
  constructor (client) {
    super({
      name: 'favcolor',
      aliases: ['favoritecolor', 'sethex', 'setcolor'],
      category: 'social',
      requirements: { databaseOnly: true },
      parameters: [{
        type: 'color',
        full: true,
        missingError: 'errors:invalidColor'
      }]
    }, client)
  }

  async run ({ t, author, channel, userDocument }, color) {
    const hexcode = color.rgb(true)

    try {
      const embed = new SwitchbladeEmbed(author)
      await this.client.controllers.social.setFavoriteColor(author.id, hexcode)
      embed.setColor(hexcode)
        .setTitle(t('commands:favcolor.changedSuccessfully', { hexcode }))
      channel.send({ embeds: [embed] })
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
