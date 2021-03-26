const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

module.exports = class Correios extends Command {
  constructor (client) {
    super({
      name: 'correios',
      alias: ['trackCorreios'],
      category: 'government',
      requirements: {
        apis: ['correios']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:correios.notFound'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, tCode) {
    const tracked = await this.client.apis.correios.trackCode(tCode)
    moment.locale(language)
    try {
      const laststate = tracked[0].tracks[tracked[0].tracks.length - 1]
      channel.send(
        new SwitchbladeEmbed()
          .setAuthor(`${tracked[0].code}`, 'https://i.imgur.com/QRBKPwm.png')
          .setTitle(laststate.locale.toUpperCase())
          .setDescription(`${laststate.status.toUpperCase()} ${laststate.observation ? laststate.observation.toUpperCase() : ''}`)
          .setColor(tracked[0].isDelivered ? Constants.SPOTIFY_COLOR : '#0f75bc')
          .setFooter(t('commands:correios.lastUpdated'))
          .setTimestamp(laststate.trackedAt)
      )
    } catch (e) {
      channel.stopTyping(true)
      throw new CommandError(t('commands:correios.notFound'))
    }
  }
}
