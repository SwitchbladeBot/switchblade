const { CanvasTemplates, Command, CommandError } = require('../../')
const { MessageAttachment } = require('discord.js')
const moment = require('moment')

module.exports = class Weather extends Command {
  constructor (client) {
    super({
      name: 'weather',
      category: 'utility',
      requirements: {
        canvasOnly: true,
        apis: ['positionstack', 'darksky']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:weather.noCity'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, address) {
    moment.locale(language)
    channel.startTyping()
    try {
      const city = await this.client.apis.positionstack.getAddress(address)
      const { latitude, longitude } = city.data[0]
      // TODO: configurable units
      const [lang] = language.split('-')
      const { currently, daily: { data: daily }, timezone } = await this.client.apis.darksky.getForecast(latitude, longitude, { lang, units: 'ca' })
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

      const tempUnit = '°C'
      const weather = await CanvasTemplates.weather({ t }, `${city.data[0].locality.toUpperCase()}${city.data[0].region ? ` - ${city.data[0].region_code}` : ''}`, weatherInfo, tempUnit)

      channel.send(new MessageAttachment(weather, 'weather.png')).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:weather.notFound'))
    }
  }

  tempHumanize (temp, fixSize = false) {
    return parseFloat(temp.toFixed(fixSize && temp < 0 ? 0 : 1))
  }
}
