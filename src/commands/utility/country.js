const { Command, CommandError, SwitchbladeEmbed, MiscUtils } = require('../../')
const fetch = require('node-fetch')

module.exports = class Country extends Command {
  constructor (client) {
    super({
      name: 'country',
      category: 'utility',
      parameters: [{
        type: 'string',
        missingError: 'commands:country.noCountry',
        full: true
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, country) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const endpoint = country.split('').length <= 3 ? 'alpha' : 'name'
    try {
      const data = await fetch(`https://restcountries.eu/rest/v2/${endpoint}/${encodeURIComponent(country)}`)
        .then(res => res.json())
        .then(body => body[0] || body)
        .catch(err => err)

      embed
        .setTitle(`:flag_${data.alpha2Code.toLowerCase()}: ${data.name}`)
        .setDescriptionFromBlockArray([
          [
            t('commands:country.aka', { alts: data.altSpellings.join(', ') })
          ],
          [
            t('commands:country.languages', { languages: data.languages.map(l => `**${l.name}** (${l.nativeName})`).join(', ') }),
            t('commands:country.capital', { capital: data.capital }),
            t('commands:country.region', { region: data.region, subregion: data.subregion }),
            t('commands:country.population', { population: MiscUtils.formatNumber(data.population, language) }),
            t('commands:country.area', { area: MiscUtils.formatNumber(data.area, language) }),
            t('commands:country.timezones', { timezones: data.timezones.join(', ') })
          ],
          [
            t('commands:country.currencies', { currencies: data.currencies.map(c => `**${c.name}** (${c.symbol})`).join(', ') }),
            data.regionalBlocs.length > 0 ? t('commands:country.treaties', { treaties: data.regionalBlocs.map(b => `**${b.acronym}** - ${b.name}`).join(', ') }) : null
          ]
        ])

      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      channel.stopTyping()
      throw new CommandError(`${t('errors:generic')}`)
    }
  }
}
