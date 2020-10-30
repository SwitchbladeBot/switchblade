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
      const { data } = await this.client.apis.covid.getContinent(continent)
      channel.send(
        new SwitchbladeEmbed(author)
          .setColor(Constants.GENERIC_RED_COLOR)
          .setAuthor(`${data.continent} - (${MiscUtils.formatNumber(data.tests, language)} ${t('commands:covid.tested')}) - ${data.countries.length} ${t('commands:covid.subcommands.continents.countries')}`, 'https://i.imgur.com/Rnobe3k.png')
          .setDescription(t('commands:covid.source'))
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
      throw new CommandError(t('commands:covid.subcommands.continent.notFound'))
    }
  }
}
