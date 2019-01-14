const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../index')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

const snekfetch = require('snekfetch')

const baseUrl = 'https://xkcd.com'

module.exports = class XKCD extends Command {
  constructor (client) {
    super(client)
    this.name = 'xkcd'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: false })
    )
  }

  async run ({ t, author, channel }, arg) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed()
    let response
    try {
      if (arg) {
        if (arg === 'latest') {
          response = await snekfetch.get(baseUrl + '/info.0.json')
        } else if (arg.match(/^\d+$/)) {
          response = await snekfetch.get(baseUrl + `/${arg}/info.0.json`)
        } else {
          throw new CommandError(t('commands:xkcd.invalidArgument'), true)
        }
      } else {
        const latestResp = await snekfetch.get(`${baseUrl}/info.0.json`)
        const latestNumber = latestResp.body.num
        const randomNumber = Math.floor(Math.random() * latestNumber + 1)
        response = await snekfetch.get(`${baseUrl}/${randomNumber}/info.0.json`)
      }
    } catch (e) {
      if (e.statusCode === 404) {
        throw new CommandError(t('commands:xkcd.notFound'))
      }
      throw new CommandError(new SwitchbladeEmbed(author).setTitle(t('errors:generic'))
        .setDescription(`\`${e.message}\`\n\n[${t('commons:reportThis')}](https://github.com/SwitchbladeBot/switchblade/issues)`))
    }

    if (response && response.ok) {
      const xkcd = response.body
      embed.setColor(Constants.XKCD_COLOR)
        .setTitle(`#${xkcd.num} - "${xkcd.title}"`)
        .setURL(`http://xkcd.com/${xkcd.num}`)
        .setDescription(xkcd.alt)
        .setImage(xkcd.img)
      channel.send(embed).then(() => { channel.stopTyping() })
    }
  }
}
