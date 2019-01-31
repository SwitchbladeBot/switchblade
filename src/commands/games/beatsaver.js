const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const snekfetch = require('snekfetch')
const cheerio = require('cheerio')

module.exports = class BeatSaver extends Command {
  constructor (client) {
    super(client)
    this.name = 'beatsaver'
    this.aliases = ['beatsaber', 'bsaver']
    this.category = 'games'

    this.parameters = new CommandParameters(this,
      new StringParameter({ missingError: 'commands:beatsaver.noQuery' })
    )
  }

  async run ({ t, author, channel }, query) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    let url = await parseQuery(query)

    if (!url) {
      embed
        .setTitle(t('commands:beatsaver.notFound'))
        .setColor(Constants.ERROR_COLOR)
      channel.send(embed).then(channel.stopTyping())
      return
    }

    const { body } = await snekfetch.get(url)
    const $ = cheerio.load(body)
    if (body) {
      const title = $('body > div > div > h2').text()
      const downloadUrl = $('body > div > div > div > div > a').attr('href')
      const imageUrl = $('body > div > div > div > div > img').attr('src')
      embed
        .setColor(0x3C347B)
        .setAuthor('Beat Saver', 'https://i.imgur.com/yK8SmyX.png')
        .setTitle(title)
        .setThumbnail(imageUrl)
        .setDescription(`**[${t('commands:beatsaver.download')}](${downloadUrl})** - [${t('commands:beatsaver.details')}](${url})`)
    } else {
      embed
        .setTitle(t('commands:beatsaver.notFound'))
        .setColor(Constants.ERROR_COLOR)
    }

    channel.send(embed).then(channel.stopTyping())
  }
}

async function parseQuery (query) {
  const match = query.match(/\d+-\d+/)
  if (match) {
    return `https://beatsaver.com/browse/detail/${match}`
  } else {
    const { body } = await snekfetch.get(`https://beatsaver.com/search/all/0?key=${encodeURIComponent(query)}`)
    const $ = cheerio.load(body)
    return $('body > div > div:nth-child(3) > h2 > a').attr('href')
  }
}
