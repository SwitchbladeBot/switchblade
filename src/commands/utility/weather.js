const { CanvasTemplates, CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const { Attachment } = require('discord.js')
const moment = require('moment-timezone')

const icons = [ 'clear-day',
  'clear-night',
  'cloudy',
  'fog',
  'partly-cloudy-day',
  'partly-cloudy-night',
  'rain',
  'snow',
  'thunderstorm',
  'wind' ]

module.exports = class Weather extends Command {
  constructor (client) {
    super(client)
    this.name = 'weather'
    this.category = 'utility'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:weather.noCity' })
    )
  }

  async run ({ t, author, channel, language }, address) {
    moment.locale(language)
    channel.startTyping()
    const city = await this.client.apis.gmaps.searchCity(address)
    if (city) {
      const cityLocation = city.geometry.location
      const weatherData = await this.client.apis.darksky.getForecast(cityLocation.lat, cityLocation.lng, { lang: language.split('-')[0], units: 'ca' })
      const currently = weatherData.currently
      const daily = weatherData.daily.data

      const weatherInfo = {
        now: {
          temperature: `${this.tempHumanize(currently.temperature)}°`,
          wind: `${this.tempHumanize(currently.windSpeed)} km/h`,
          max: `${this.tempHumanize(daily[0].temperatureHigh)}°`,
          min: `${this.tempHumanize(daily[0].temperatureLow)}°`,
          icon: icons.indexOf(currently.icon)
        }
      }

      daily.map(d => {
        d.temperature = this.tempHumanize((d.temperatureHigh + d.temperatureLow) / 2)
        d.icon = icons.indexOf(d.icon)
        d.weekday = this.getTimeData(d.time, weatherData.timezone).format('ddd')
      })

      weatherInfo.daily = daily
      const cityName = city.address_components.find(comp => comp.types.includes('administrative_area_level_2') || comp.types.includes('locality')).short_name
      const stateName = city.address_components.find(comp => comp.types.includes('administrative_area_level_1')).short_name
      const weather = await CanvasTemplates.weather({ t }, `${cityName} - ${stateName}`, weatherInfo)

      channel.send(new Attachment(weather, 'weather.png')).then(() => channel.stopTyping())
    } else {
      channel.send(new SwitchbladeEmbed(author)
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:weather.notFound')))
    }
  }

  getTimeData (time, tz) {
    let timeTz = moment.unix(time).tz(tz)
    time = new Date(timeTz._d.valueOf() + timeTz._d.getTimezoneOffset() * 60000)
    return moment(time)
  }

  tempHumanize (temp) {
    return parseFloat(temp.toFixed(1))
  }
}
