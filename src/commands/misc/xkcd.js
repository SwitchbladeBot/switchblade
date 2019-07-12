const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

const fetch = require('node-fetch')

const baseUrl = 'https://xkcd.com'

module.exports = class XKCD extends Command {
  constructor (client) {
    super(client, {
      name: 'xkcd',
      parameters: [{
        type: 'string', full: true, required: false
      }]
    })
  }

  async run ({ t, author, channel }, arg) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed()
    let response
    try {
      if (arg) {
        if (arg === 'latest') {
          response = await fetch(baseUrl + '/info.0.json').then(res => res.json())
        } else if (arg.match(/^\d+$/)) {
          response = await fetch(baseUrl + `/${arg}/info.0.json`).then(res => res.json())
        } else {
          throw new CommandError(t('commands:xkcd.invalidArgument'), true)
        }
      } else {
        const latestResp = await fetch(`${baseUrl}/info.0.json`).then(res => res.json())
        console.log(latestResp)
        const latestNumber = latestResp.num
        const randomNumber = Math.floor(Math.random() * latestNumber + 1)
        response = await fetch(`${baseUrl}/${randomNumber}/info.0.json`).then(res => res.json())
      }
    } catch (e) {
      if (e.statusCode === 404) {
        throw new CommandError(t('commands:xkcd.notFound'))
      }
      throw new CommandError(new SwitchbladeEmbed(author).setTitle(t('errors:generic'))
        .setDescription(`\`${e.message}\`\n\n[${t('commons:reportThis')}](https://github.com/SwitchbladeBot/switchblade/issues)`))
    }

    if (response) {
      embed.setColor(Constants.XKCD_COLOR)
        .setTitle(`#${response.num} - "${response.title}"`)
        .setURL(`http://xkcd.com/${response.num}`)
        .setDescription(response.alt)
        .setImage(response.img)
      channel.send(embed).then(() => { channel.stopTyping() })
    }
  }
}
