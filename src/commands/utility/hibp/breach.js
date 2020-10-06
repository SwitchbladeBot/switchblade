const { Command, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class HIBPBreach extends Command {
  constructor (client) {
    super({
      name: 'breach',
      aliases: ['b'],
      parent: 'hibp',
      parameters: [{
        type: 'string', missingError: 'commands:hibp.noEmail'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, query) {
    channel.startTyping()
    try {
      moment.locale(language)
      const data = await this.client.apis.hibp.getBreaches(query)
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.PWNED_COLOR)
        .setAuthor(t('commands:hibp.breached'), this.parentCommand.HIBP_LOGO)
        .setDescription(`${data.length > 1 ? t('commands:hibp.subcommands.breach.pwnedInPlural', { count: MiscUtils.formatNumber(data.length, language) }) : t('commands:hibp.subcommands.breach.pwnedInSingular')}:\n\n${data.slice(0, 5).map(breach => `**${breach.Title}** - ${moment(breach.BreachDate).format('LLL')}`).join('\n')}${data.length > 5 ? `\n${t('commands:hibp.andMore', { count: data.length - 5 })}` : ''}`)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      channel.send(new SwitchbladeEmbed(author)
        .setColor(Constants.NOT_PWNED_COLOR)
        .setAuthor(t('commands:hibp.notBreached'), this.parentCommand.HIBP_LOGO)
        .setDescription(t('commands:hibp.subcommands.breach.notFoundBreach'))
      ).then(() => channel.stopTyping())
    }
  }
}
