const { CanvasTemplates, Command, CommandError } = require('../../')
const { Attachment } = require('discord.js')
const moment = require('moment')

module.exports = class Weather extends Command {
  constructor (client) {
    super(client, {
      name: 'weather',
      category: 'utility',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:weather.noCity'
      }]
    })
  }

  async run ({ t, author, channel, language }, address) {
    moment.locale(language)
    channel.startTyping()
    const city = await this.client.apis.gmaps.searchCity(address)
    if (city) {
      const [ lang ] = language.split('-')
      const { lat, lng } = city.geometry.location
      // TODO: configurable units
      const { currently, daily: { data: daily }, timezone } = await this.client.apis.darksky.getForecast(lat, lng, { lang, units: 'ca' })

      const now = daily.shift()
      const weatherInfo = {
        now: {
          temperature: `${this.tempHumanize(currently.temperature, true)}`,
          wind: `${this.tempHumanize(currently.windSpeed)} km/h`,
          max: this.tempHumanize(now.temperatureHigh),
          min: this.tempHumanize(now.temperatureLow),
          icon: currently.icon
        },
        daily: daily.slice(0, 6).map(d => {
          d.temperature = this.tempHumanize((d.temperatureHigh + d.temperatureLow) * 0.5, true)
          d.weekday = moment.unix(d.time).tz(timezone).format('ddd')
          return d
        })
      }

      const cityName = city.address_components.find(({ types }) => types.includes('administrative_area_level_2') || types.includes('locality')).short_name
      const state = city.address_components.find(({ types }) => types.includes('administrative_area_level_1'))

      const tempUnit = '°C'
      const weather = await CanvasTemplates.weather({ t }, `${cityName.toUpperCase()}${state ? ` - ${state.short_name}` : ''}`, weatherInfo, tempUnit)

      channel.send(new Attachment(weather, 'weather.png')).then(() => channel.stopTyping())
    } else {
      throw new CommandError(t('commands:weather.notFound'))
    }
  }

  tempHumanize (temp, fixSize = false) {
    return parseFloat(temp.toFixed(fixSize && temp < 0 ? 0 : 1))
  }
}
