const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const malScraper = require('mal-scraper')

module.exports = class MyAnimeList extends Command {
  constructor (client) {
    super(client)
    this.name = 'myanimelist'
    this.aliases = ['mal']
    this.category = 'anime'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:myanimelist.noAnime' })
    )
  }

  async run ({ t, author, channel }, anime) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const data = await malScraper.getInfoFromName(anime)
      if (data) {
        embed
          .setThumbnail(data.picture)
          .setDescription(data.synopsis.split('\n\n')[0])
          .setColor(Constants.MAL_COLOR)
          .setTitle(data.title + (data.japaneseTitle ? ` (${data.japaneseTitle})` : ''))
          .setURL(data.url)
          .setAuthor('MyAnimeList', 'https://myanimelist.cdn-dena.com/img/sp/icon/apple-touch-icon-256.png')
          .addField(t('commands:myanimelist.score'), `${data.score} (${data.ranked})`, true)
          .addField(t('commands:myanimelist.studio', { count: data.studios.length }), data.studios.join(', '), true)
          .addField(t('commands:myanimelist.episodes'), data.episodes, true)
          .addField(t('commands:myanimelist.aired'), data.aired, true)
      }
    } catch (e) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:myanimelist.animeNotFound'))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
