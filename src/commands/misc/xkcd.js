const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures

const snekfetch = require('snekfetch')

const baseUrl = 'https://xkcd.com'

module.exports = class XKCD extends Command {
  constructor (client) {
    super(client)
    this.name = 'xkcd'

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, required: false})
    )
  }

  async run ({ t, author, channel }, arg) {
    channel.startTyping()
    let response
    try {
      if (arg) {
        if (arg === 'latest') {
          response = await snekfetch.get(baseUrl + '/info.0.json')
        } else if (arg.match(/^\d+$/)) {
          response = await snekfetch.get(baseUrl + `/${arg}/info.0.json`)
        } else {
          channel.send(new SwitchbladeEmbed()
            .setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:xkcd.invalidArgument'))
            .setDescription(`**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:xkcd.commandUsage')}\``)
          ).then(() => { channel.stopTyping() })
        }
      } else {
        const latestResp = await snekfetch.get(baseUrl + `/info.0.json`)
        const latestNumber = latestResp.body.num
        const randomNumber = Math.floor(Math.random() * latestNumber + 1)
        response = await snekfetch.get(baseUrl + `/${randomNumber}/info.0.json`)
      }
    } catch (e) {
      if (e.statusCode === 404) {
        channel.send(new SwitchbladeEmbed()
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:xkcd.notFound'))
        ).then(() => { channel.stopTyping() })
      } else {
        channel.send(new SwitchbladeEmbed()
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('errors:generic'))
          .setDescription(`\`${e.message}\`\n\n[${t('commons:reportThis')}](https://github.com/SwitchbladeBot/switchblade/issues)`)
        ).then(() => { channel.stopTyping() })
      }
    }

    if (response && response.ok) {
      const xkcd = response.body
      channel.send(new SwitchbladeEmbed()
        .setColor(0x96A8C8)
        .setTitle(`#${xkcd.num} - "${xkcd.title}"`)
        .setURL('http://xkcd.com/' + xkcd.num)
        .setDescription(xkcd.alt)
        .setImage(xkcd.img)
      ).then(() => { channel.stopTyping() })
    }
  }
}
