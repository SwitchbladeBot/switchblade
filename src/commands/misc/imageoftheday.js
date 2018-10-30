const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures
const Parser = require('rss-parser')
const parser = new Parser()

module.exports = class ImageOfTheDay extends Command {
  constructor (client) {
    super(client)

    this.name = 'imageoftheday'
    this.aliases = ['iotd']
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const feed = await parser.parseURL('https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss')
    const item = feed.items[0]
    embed
      .setAuthor(t('commands:imageoftheday.embedAuthor'), 'https://i.imgur.com/bHmqqHL.jpg')
      .setTitle(item.title)
      .setURL(item.link)
      .setImage(item.enclosure.url)
      .setDescription(item.content)
      .setColor(0x0b3d91)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
