const { SwitchbladeEmbed, Constants, Command } = require('../../')
const moment = require('moment')

const MEDIA_WHITE_LIST = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFilm', 'tvShow', 'software', 'ebook', 'all']

module.exports = class Itunes extends Command {
  constructor (client) {
    super({
      name: 'itunes',
      requirements: { apis: ['itunes'] },
      parameters: [{
        type: "string",
        full: false,
        name: "media",
        whitelist: MEDIA_WHITE_LIST,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:itunes.noMedia'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:itunes.availableMedia')}:**__`,
              `**${MEDIA_WHITE_LIST.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n'))
        },
        required: true,
      } , {
        type: "string",
        full: true,
        name: "term",
        required: true,
      }, {
        type: "string",
        full: false,
        name: "country",
        required: false,
      }]
    },
    client)

    this.author = null

    this.embedUrl = "https://i.imgur.com/U4jjk5F.png"

  }

  async run (context , media , term , country = "US") {
    this.author = context.author

    const data = await this.client.apis.itunes.search(media , term , country)

    this.parseResponse(context , await data , context.message.content)
  }

  searchResultFormatter (i) {
    return `[${i.trackName}](${i.trackViewUrl}) - [${i.artistName}](${i.artistViewUrl})`
  }

  getRatingEmojis (rating) {
    return (this.getEmoji('ratingstar', '⭐').repeat(Math.floor(rating))) +
            (this.getEmoji('ratinghalfstar')
              .repeat(Math.ceil(rating - Math.floor(rating))))
  }
  
  async parseResponse({ channel , author, t } , data , title) {
    var description = ""

    var index = 1

    const formatNumber = (n) => Number(n) > 9 ? n : '0' + n

    for(let item of data){
      description += `\`${formatNumber(index)}\`: ${this.searchResultFormatter(item)} \n`

      index++
    }

    const embed = new SwitchbladeEmbed(author)
                      .setThumbnail(this.embedUrl)
                      .setDescription(description)
                      .setTitle(t("commands:itunes.title" , { title: title }))

    channel.send(embed)
  }
}
