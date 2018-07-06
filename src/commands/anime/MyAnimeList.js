const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const malScraper = require('mal-scraper')

module.exports = class MyAnimeList extends Command {
  constructor (client) {
    super(client)
    this.name = 'myanimelist'
    this.aliases = ['mal']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:myanimelist.noAnime'})
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
      .setAuthor('MyAnimeList', 'https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png')
      .addField(t('commands:myanimelist.score'), data.score)
      .addField(t('commands:myanimelist.episodes'), data.episodes)

    channel.send(embed).then(() => channel.stopTyping())
  }
}
