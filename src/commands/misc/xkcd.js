const { Command, SwitchbladeEmbed, Constants } = require('../../index')
const snekfetch = require('snekfetch')

const baseUrl = 'https://xkcd.com'

module.exports = class XKCD extends Command {
  constructor (client) {
    super(client)
    this.name = 'xkcd'
  }

  async run (message, args, t) {
    message.channel.startTyping()
    let response
    try {
      if (args.length > 0) {
        if (args[0] === 'latest') {
          response = await snekfetch.get(baseUrl + '/info.0.json')
        } else if (args[0].match(/^\d+$/)) {
          response = await snekfetch.get(baseUrl + `/${args[0]}/info.0.json`)
        } else {
          message.channel.send(new SwitchbladeEmbed()
            .setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:xkcd.invalidArgument'))
            .setDescription(`**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:xkcd.commandUsage')}\``)
          ).then(() => { message.channel.stopTyping() })
        }
      } else {
        const latestResp = await snekfetch.get(baseUrl + `/info.0.json`)
        const latestNumber = latestResp.body.num
        const randomNumber = Math.floor(Math.random() * latestNumber + 1)
        response = await snekfetch.get(baseUrl + `/${randomNumber}/info.0.json`)
      }
    } catch (e) {
      if (e.statusCode === 404) {
        message.channel.send(new SwitchbladeEmbed()
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:xkcd.notFound'))
        ).then(() => { message.channel.stopTyping() })
      } else {
        message.channel.send(new SwitchbladeEmbed()
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('errors:generic'))
          .setDescription(`\`${e.message}\`\n\n[${t('commons:reportThis')}](https://github.com/SwitchbladeBot/switchblade/issues)`)
        ).then(() => { message.channel.stopTyping() })
      }
    }

    if (response && response.ok) {
      const xkcd = response.body
      message.channel.send(new SwitchbladeEmbed()
        .setColor(0x96A8C8)
        .setTitle(`#${xkcd.num} - "${xkcd.title}"`)
        .setURL('http://xkcd.com/' + xkcd.num)
        .setDescription(xkcd.alt)
        .setImage(xkcd.img)
      ).then(() => { message.channel.stopTyping() })
    }
  }
}
