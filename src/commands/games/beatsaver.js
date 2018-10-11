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
      const downloadUrl = $('body > div > div > table > tbody > tr:nth-child(1) > th.text-center > div:nth-child(3) > a')[0].attribs.href
      embed
        .setColor(0x3C347B)
        .setAuthor('Beat Saver', 'https://i.imgur.com/yK8SmyX.png')
        .setTitle($('body > div > div > h2').text())
        .setThumbnail(($('body > div > div > table > tbody > tr:nth-child(1) > th.text-center > div:nth-child(1) > img')[0].attribs.src))
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
  const match = query.match(/[0-9]*-[0-9]*/)
  if (match) {
    return `https://beatsaver.com/browse/detail/${match}`
  } else {
    const { body } = await snekfetch.get(`https://beatsaver.com/search/all/${encodeURIComponent(query)}`)
    const $ = cheerio.load(body)
    const map = $('body > div > div > table:nth-child(3) > tbody > tr:nth-child(1) > th.text-center > div:nth-child(3) > a')[0]
    if (map) return map.attribs.href
  }
}
