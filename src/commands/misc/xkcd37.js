const { Command, SwitchbladeEmbed, Constants } = require('../../index')

module.exports = class XKCD37 extends Command {
  constructor (client) {
    super(client)
    this.name = 'xkcd37'
  }

  // Context: https://xkcd.com/37/

  async run (message, args, t) {
    let embed = new SwitchbladeEmbed(message.author)
    if (args.length > 0) {
      embed
        .setTitle(args.join(' ').replace(/(\w+?)(?!\\)+(-ass)(\s+)(\S+?)/g, '$1$3ass-$4').replace(/\\-/g, '-'))
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:noSentence'))
        .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:xkcd37.commandUsage')}`)
    }
    message.channel.send(embed)
  }
}
