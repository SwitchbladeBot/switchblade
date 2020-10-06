const { Command, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class HIBPPaste extends Command {
  constructor (client) {
    super({
      name: 'paste',
      aliases: ['p'],
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
      const data = await this.client.apis.hibp.getPastes(query)
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.PWNED_COLOR)
        .setAuthor(t('commands:hibp.breached'), this.parentCommand.HIBP_LOGO)
        .setDescription(`${data.length > 1 ? t('commands:hibp.subcommands.paste.pwnedInPlural', { count: MiscUtils.formatNumber(data.length, language) }) : t('commands:hibp.subcommands.paste.pwnedInSingular')}:\n\n${data.slice(0, 5).map(paste => `**${paste.Source}** - ${encodeURI(paste.Id)} ${paste.Date !== null ? `- ${moment(paste.Date).format('LLL')}` : ''}`).join('\n')}${data.length > 5 ? `\n${t('commands:hibp.andMore', { count: data.length - 5 })}` : ''}`)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      channel.send(new SwitchbladeEmbed(author)
        .setColor(Constants.NOT_PWNED_COLOR)
        .setAuthor(t('commands:hibp.notBreached'), this.parentCommand.HIBP_LOGO)
        .setDescription(t('commands:hibp.subcommands.paste.notFoundPaste'))
      ).then(() => channel.stopTyping())
    }
  }
}
