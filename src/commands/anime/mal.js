const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const malScraper = require('mal-scraper')

module.exports = class MAL extends Command {
  constructor (client) {
    super(client)
    this.name = 'mal'
    this.aliases = ['myanimelist']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:mal.noAnime'})
    )
  }

  async run ({ t, author, channel }, anime) {
    const embed = new SwitchbladeEmbed(author)
    const data = await malScraper.getInfoFromName(anime)
    channel.startTyping()

    embed
    .setThumbnail(data.picture)
    .setDescription(data.synopsis)
    .setColor(Constants.MAL_COLOR)
    .setTitle(data.title, data.url)
    .setAuthor("MyAnimeList", "https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png")
    .addField(t('commands:mal.score'), data.score)
    .addField(t('commands:mal.episodes'), data.episodes)

  channel.send(embed).then(() => channel.stopTyping())
  }
}
