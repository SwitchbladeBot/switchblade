const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const moment = require('moment')
const fetch = require('node-fetch')

const countries = {
  AD: 'Andorra',
  AL: 'Albania',
  AR: 'Argentina',
  AT: 'Austria',
  AU: 'Australia',
  AX: 'Åland Islands',
  BB: 'Barbados',
  BE: 'Belgium',
  BG: 'Bulgaria',
  BJ: 'Benin',
  BO: 'Bolivia',
  BR: 'Brazil',
  BS: 'Bahamas',
  BW: 'Botswana',
  BY: 'Belarus',
  BZ: 'Belize',
  CA: 'Canada',
  CH: 'Switzerland',
  CL: 'Chile',
  CN: 'China',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czechia',
  DE: 'Germany',
  DK: 'Denmark',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EE: 'Estonia',
  EG: 'Egypt',
  ES: 'Spain',
  FI: 'Finland',
  FO: 'Faroe Islands',
  FR: 'France',
  GA: 'Gabon',
  GB: 'United Kingdom',
  GD: 'Grenada',
  GL: 'Greenland',
  GM: 'Gambia',
  GR: 'Greece',
  GT: 'Guatemala',
  GY: 'Guyana',
  HN: 'Honduras',
  HR: 'Croatia',
  HT: 'Haiti',
  HU: 'Hungary',
  ID: 'Indonesia',
  IE: 'Ireland',
  IM: 'Isle of Man',
  IS: 'Iceland',
  IT: 'Italy',
  JE: 'Jersey',
  JM: 'Jamaica',
  JP: 'Japan',
  LI: 'Liechtenstein',
  LS: 'Lesotho',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  MA: 'Morocco',
  MC: 'Monaco',
  MD: 'Moldova',
  MG: 'Madagascar',
  MK: 'Macedonia',
  MN: 'Mongolia',
  MT: 'Malta',
  MX: 'Mexico',
  MZ: 'Mozambique',
  NA: 'Namibia',
  NE: 'Niger',
  NI: 'Nicaragua',
  NL: 'Netherlands',
  NO: 'Norway',
  NZ: 'New Zealand',
  PA: 'Panama',
  PE: 'Peru',
  PL: 'Poland',
  PR: 'Puerto Rico',
  PT: 'Portugal',
  PY: 'Paraguay',
  RO: 'Romania',
  RS: 'Serbia',
  RU: 'Russia',
  SE: 'Sweden',
  SI: 'Slovenia',
  SJ: 'Svalbard and Jan Mayen',
  SK: 'Slovakia',
  SM: 'San Marino',
  SR: 'Suriname',
  SV: 'El Salvador',
  TN: 'Tunisia',
  TR: 'Turkey',
  UA: 'Ukraine',
  US: 'United States',
  UY: 'Uruguay',
  VA: 'Vatican City',
  VE: 'Venezuela',
  VN: 'Vietnam',
  ZA: 'South Africa',
  ZW: 'Zimbabwe'
}

module.exports = class Holidays extends Command {
  constructor (client) {
    super(client, {
      name: 'holidays',
      category: 'utility',
      parameters: [{
        type: 'string',
        whitelist: Object.keys(countries),
        missingError: ({ t }) => {
          return new SwitchbladeEmbed()
            .setTitle(t('commands:holidays.invalidCountry'))
            .setDescription(Object.entries(countries)
              .map(([countryCode, countryName]) =>
                `${countryCode} - ${countryName}`
              ).join('\n')
            )
        }
      }, {
        type: 'number',
        required: false,
        min: 0
      }]
    })
  }

  async run ({ t, author, channel }, countryCode = '', year = moment().year()) {
    try {
      channel.startTyping()
      const embed = new SwitchbladeEmbed(author)
      const countryName = countries[countryCode.toUpperCase()]
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
