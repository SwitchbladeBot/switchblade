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
      const stateData = await this.client.apis.covid.getState(state)
      channel.send(
        new SwitchbladeEmbed(author)
          .setColor(Constants.GENERIC_RED_COLOR)
          .setDescription(t('commands:covid.source'))
          .setThumbnail(`https://cdn.jsdelivr.net/gh/CivilServiceUSA/us-states/images/flags/${stateData.state.toLowerCase().replace(' ', '-')}-large.png`)
          .setAuthor(`${stateData.state} - ${MiscUtils.formatNumber(stateData.tests, language)} ${t('commands:covid.tested')}`, 'https://i.imgur.com/Rnobe3k.png')
          .addField(t('commands:covid.cases'), MiscUtils.formatNumber(stateData.cases, language), true)
          .addField(t('commands:covid.todayCases'), MiscUtils.formatNumber(stateData.todayCases, language), true)
          .addField(t('commands:covid.activeCases'), MiscUtils.formatNumber(stateData.active, language), true)
          .addField(t('commands:covid.deaths'), MiscUtils.formatNumber(stateData.deaths, language), true)
          .addField(t('commands:covid.recovered'), MiscUtils.formatNumber(stateData.recovered, language), true)
          .addField(t('commands:covid.casesPerOneMillion'), MiscUtils.formatNumber(stateData.casesPerOneMillion, language), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(stateData.updated)
      )
    } catch (e) {
      throw new CommandError(t('commands:covid.subcommands.states.notFound'))
    }
  }
}
