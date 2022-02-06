const { Command, SwitchbladeEmbed } = require('../../../')

module.exports = class HearthStoneCardCommands extends Command {
  constructor (client) {
    super(
      {
        name: 'cards',
        aliases: ['cards', 'c'],
        parent: 'hearthstone'
      },
      client
    )
  }

  async run ({ t, author, channel, prefix, language }, cardId) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const { embedColor } = this.parentCommand
    try {
      const { name, cardSet, type, faction, rarity, cost, atack, health, text, img } = await this.client.apis.hearthstoneapi.getCardsById(cardId)
      channel.send(
        embed.setAuthor(author)
          .setColor(embedColor)
          .setImage(img)
          .setTitle(name)
          .setDescriptionFromBlockArray([` -/ CardSet: ${cardSet}
        -/ Type: ${type}
        -/ Faction: ${faction}
        -/ Rarity: ${rarity}
        -/ Cost: ${cost}
        -/ Atack: ${atack}
        -/ Heallth: ${health} points
        -/ Text        `,
              `${text}`])
      )
    } catch (e) {
      channel.send(new SwitchbladeEmbed().setTitle('Card not Found !').setDescription('Search for a valid card Id !')).then(() => channel.stopTyping())
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
