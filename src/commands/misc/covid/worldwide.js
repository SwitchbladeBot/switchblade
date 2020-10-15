const { Command, CommandError, SwitchbladeEmbed, MiscUtils, Constants } = require('../../../')

const moment = require('moment')

module.exports = class CovidWorldwide extends Command {
  constructor (client) {
    super({
      name: 'worldwide',
      aliases: ['w', 'world'],
      parent: 'covid'
    }, client)
  }

  async run ({ t, author, channel, language }) {
    moment.locale(language)
    try {
      const { data } = await this.client.apis.covid.getWorldwide()
      channel.send(
        new SwitchbladeEmbed(author)
          .setColor(Constants.NPM_COLOR)
          .setAuthor(`${MiscUtils.formatNumber(data.tests, language)} ${t('commands:covid.tested')}`, 'https://i.imgur.com/Rnobe3k.png')
          .addField(t('commands:covid.cases'), MiscUtils.formatNumber(data.cases, language), true)
          .addField(t('commands:covid.todayCases'), MiscUtils.formatNumber(data.todayCases, language), true)
          .addField(t('commands:covid.activeCases'), MiscUtils.formatNumber(data.active, language), true)
          .addField(t('commands:covid.recovered'), MiscUtils.formatNumber(data.recovered, language), true)
          .addField(t('commands:covid.subcommands.worldwide.casesPerOneMillion'), MiscUtils.formatNumber(data.casesPerOneMillion, language), true)
          .addField(t('commands:covid.subcommands.worldwide.affectedCountries'), MiscUtils.formatNumber(data.affectedCountries, language), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(data.updated)
      )
    } catch (e) {
      throw new CommandError('deu erro rapai')
    }
  }
}
