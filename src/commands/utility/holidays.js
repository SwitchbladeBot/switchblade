const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const moment = require('moment')
const fetch = require('node-fetch')

const supportedCountries = [
  'AD', 'AL', 'AR', 'AT', 'AU', 'AX', 'BB', 'BE', 'BG', 'BJ', 'BO', 'BR',
  'BS', 'BW', 'BY', 'BZ', 'CA', 'CH', 'CL', 'CN', 'CO', 'CR', 'CU', 'CY',
  'CZ', 'DE', 'DK', 'DO', 'EC', 'EE', 'EG', 'ES', 'FI', 'FO', 'FR', 'GA',
  'GB', 'GD', 'GL', 'GM', 'GR', 'GT', 'GY', 'HN', 'HR', 'HT', 'HU', 'ID',
  'IE', 'IM', 'IS', 'IT', 'JE', 'JM', 'JP', 'LI', 'LS', 'LT', 'LU', 'LV',
  'MA', 'MC', 'MD', 'MG', 'MK', 'MN', 'MT', 'MX', 'MZ', 'NA', 'NE', 'NI',
  'NL', 'NO', 'NZ', 'PA', 'PE', 'PL', 'PR', 'PT', 'PY', 'RO', 'RS', 'RU',
  'SE', 'SI', 'SJ', 'SK', 'SM', 'SR', 'SV', 'TN', 'TR', 'UA', 'US', 'UY',
  'VA', 'VE', 'VN', 'ZA', 'ZW'
]

module.exports = class Holidays extends Command {
  constructor (client) {
    super({
      name: 'holidays',
      category: 'utility',
      parameters: [{
        type: 'string',
        whitelist: supportedCountries,
        toUpperCase: true,
        missingError: ({ t }) => {
          return new SwitchbladeEmbed()
            .setTitle(t('commands:holidays.invalidCountry'))
            .setDescription(supportedCountries
              .map(countryCode => {
                return `\`${countryCode}\``
              }
              ).join(', ')
            )
        }
      }, {
        type: 'number',
        required: false,
        min: 0
      }]
    }, client)
  }

  async run ({ t, author, channel }, countryCode = '', year = moment().year()) {
    try {
      channel.startTyping()
      const embed = new SwitchbladeEmbed(author)
      const countryName = t(`countries:${countryCode.toUpperCase()}`)
      const url = `https://date.nager.at/api/v2/publicholidays/${year}/${countryCode}`
      const holidays = await fetch(url)
        .then(res => res.json())
        .catch(e => {
          throw new CommandError(t('commands:holidays.noInformation'), true)
        })

      if (holidays) {
        channel.send(embed
          .setTitle(t('commands:holidays.title', { countryName, year }))
          .setDescription(holidays
            .map(({ date, localName }) =>
              `**${moment(date).format('Do MMMM')}** ${localName}`
            ).join('\n')
          )
        )
      }
    } catch (e) {
      throw new CommandError(t('commons:error'), true)
    } finally {
      channel.stopTyping()
    }
  }
}
