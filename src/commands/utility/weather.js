const { CanvasTemplates, CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const { Attachment } = require('discord.js')
const moment = require('moment')

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
      const [ lang ] = language.split('-')
      const { lat, lng } = city.geometry.location
      const { currently, daily: { data: daily }, timezone } = await this.client.apis.darksky.getForecast(lat, lng, { lang, units: 'ca' })

      const now = daily.shift()
      const weatherInfo = {
        now: {
          temperature: `${this.tempHumanize(currently.temperature)}°`,
          wind: `${this.tempHumanize(currently.windSpeed)} km/h`,
          max: `${this.tempHumanize(now.temperatureHigh)}°`,
          min: `${this.tempHumanize(now.temperatureLow)}°`,
          icon: currently.icon
        },
        daily: daily.slice(0, 6).map(d => {
          d.temperature = this.tempHumanize((d.temperatureHigh + d.temperatureLow) * 0.5)
          d.weekday = moment.unix(d.time).tz(timezone).format('ddd') // this.getTimeData(d.time, timezone).format('ddd')
          return d
        })
      }

      const cityName = city.address_components.find(({ types }) => types.includes('administrative_area_level_2') || types.includes('locality')).short_name
      const state = city.address_components.find(({ types }) => types.includes('administrative_area_level_1'))
      const weather = await CanvasTemplates.weather({ t }, `${cityName.toUpperCase()}${state ? ` - ${state.short_name}` : ''}`, weatherInfo)

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
