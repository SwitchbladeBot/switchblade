const { Command, CommandError, SwitchbladeEmbed, MiscUtils, Constants } = require('../../../')
const moment = require('moment')

module.exports = class CovidContinents extends Command {
  constructor (client) {
    super({
      name: 'continents',
      aliases: ['cn', 'continent'],
      parent: 'covid',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:covid.subcommands.continents.noContinent'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, continent) {
    moment.locale(language)
    try {
      const continentData = await this.client.apis.covid.getContinent(continent)
      channel.send(
        new SwitchbladeEmbed(author)
          .setColor(Constants.GENERIC_RED_COLOR)
          .setAuthor(`${continentData.continent} - (${MiscUtils.formatNumber(continentData.tests, language)} ${t('commands:covid.tested')}) - ${continentData.countries.length} ${t('commands:covid.subcommands.continents.countries')}`, 'https://i.imgur.com/Rnobe3k.png')
          .setDescription(t('commands:covid.source'))
          .addField(t('commands:covid.cases'), MiscUtils.formatNumber(continentData.cases, language), true)
          .addField(t('commands:covid.todayCases'), MiscUtils.formatNumber(continentData.todayCases, language), true)
          .addField(t('commands:covid.activeCases'), MiscUtils.formatNumber(continentData.active, language), true)
          .addField(t('commands:covid.deaths'), MiscUtils.formatNumber(continentData.deaths, language), true)
          .addField(t('commands:covid.recovered'), MiscUtils.formatNumber(continentData.recovered, language), true)
          .addField(t('commands:covid.casesPerOneMillion'), MiscUtils.formatNumber(continentData.casesPerOneMillion, language), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(continentData.updated)
      )
    } catch (e) {
      throw new CommandError(t('commands:covid.subcommands.continent.notFound'))
    }
  }
}
