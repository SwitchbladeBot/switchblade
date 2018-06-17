const { Command, SwitchbladeEmbed, Constants } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class IsItUp extends Command {
  constructor (client) {
    super(client)
    this.name = 'isitup'
  }

  async run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)
    if (args.length > 0) {
      message.channel.startTyping()
      const site = encodeURIComponent(args.join(' '))
      const {body} = await snekfetch.get(`https://isitup.org/${site}.json`)
      if (body.response_code) {
        embed
          .setTitle(t('commands:isitup.isUp', {body}))
          .setDescription(t('commands:isitup.details', {body}))
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:isitup.isDown', {body}))
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:isitup.noWebsite'))
        .setDescription(`**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${t('commands:npm.commandUsage')}\``)
    }
    message.channel.send(embed).then(() => { message.channel.stopTyping() })
  }
}
