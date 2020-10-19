const { Command, CommandError, SwitchbladeEmbed, MiscUtils, Constants } = require('../../../')
const moment = require('moment')

module.exports = class CovidStates extends Command {
  constructor (client) {
    super({
      name: 'states',
      aliases: ['s', 'state'],
      parent: 'covid',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:covid.subcommands.states.noState'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, state) {
    moment.locale(language)
    try {
      const { data } = await this.client.apis.covid.getState(state)
      channel.send(
        new SwitchbladeEmbed(author)
          .setColor(Constants.GENERIC_RED_COLOR)
          .setDescription(t('commands:covid.source'))
          .setThumbnail(`https://cdn.jsdelivr.net/gh/CivilServiceUSA/us-states/images/flags/${data.state.toLowerCase().replace(' ', '-')}-large.png`)
          .setAuthor(`${data.state} - ${MiscUtils.formatNumber(data.tests, language)} ${t('commands:covid.tested')}`, 'https://i.imgur.com/Rnobe3k.png')
          .addField(t('commands:covid.cases'), MiscUtils.formatNumber(data.cases, language), true)
          .addField(t('commands:covid.todayCases'), MiscUtils.formatNumber(data.todayCases, language), true)
          .addField(t('commands:covid.activeCases'), MiscUtils.formatNumber(data.active, language), true)
          .addField(t('commands:covid.deaths'), MiscUtils.formatNumber(data.deaths, language), true)
          .addField(t('commands:covid.recovered'), MiscUtils.formatNumber(data.recovered, language), true)
          .addField(t('commands:covid.casesPerOneMillion'), MiscUtils.formatNumber(data.casesPerOneMillion, language), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(data.updated)
      )
    } catch (e) {
      throw new CommandError(t('commands:covid.subcommands.states.notFound'))
    }
  }
}
