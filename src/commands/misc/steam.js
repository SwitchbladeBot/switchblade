const { SearchCommand, SwitchbladeEmbed, Constants, CommandError } = require('../..')
const moment = require('moment')
const iso639 = require('iso-639/data/iso_639-1.min.json')

module.exports = class Steam extends SearchCommand {
  constructor (client) {
    super({
      name: 'steam',
      aliases: ['steamstore'],
      requirements: { apis: ['steamstore'] },
      embedColor: Constants.STEAM_COLOR,
      embedLogoURL: 'https://i.imgur.com/PA1NIoK.png'
    }, client)
  }

  async search (_, query) {
    return this.client.apis.steamstore.search(query)
      .then(({ data }) => data.items)
  }

  searchResultFormatter (i) {
    return `[${i.name}](https://store.steampowered.com/app/${i.id})`
  }

  async handleResult ({ t, author, channel, language, guild }, { id }) {
    const lang = iso639[language.split(/-|_/)[0].toLowerCase()]
    const res = await this.client.apis.steamstore.info(id, lang ? lang.name.toLowerCase() : 'english')
    const {
      short_description: description,
      name,
      is_free: isFree,
      website,
      publishers,
      header_image: image,
      required_age: age,
      price_overview: priceInfo,
      categories,
      release_date: { coming_soon: comingSoon, date },
      metacritic
    } = res.data[id].data

    if (age >= 18 && guild && !channel.nsfw) throw new CommandError(t('errors:nsfwOnly'))

    moment.locale(language)

    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor('Steam Store', this.embedLogoURL, 'https://store.steampowered.com/')
        .setThumbnail(image)
        .setTitle(name)
        .setURL(website)
        .setDescriptionFromBlockArray([
          [
            description.slice(0, 1024)
          ],
          [
            isFree ? t('commands:steam.free') : priceInfo.final_formatted,
            t('commands:steam.by', { publisher: publishers.join(',') }),
            comingSoon ? t('commands:steam.comingSoon') : t('commands:steam.released', { ago: moment(new Date(date)).fromNow() })
          ],
          [
            metacritic ? `\`${t('commands:steam.metacriticScore')}\`: [${metacritic.score}](${metacritic.url})` : ''
          ],
          [
            categories.map((c) => `\`${c.description}\``).join(', ')
          ]
        ])
    )
  }
}
