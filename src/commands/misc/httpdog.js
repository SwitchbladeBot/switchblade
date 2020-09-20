const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class HttpDog extends Command {
  constructor (client) {
    super({
      name: 'httpdog',
      category: 'general',
      parameters: [{
        type: 'number',
        required: false
      }]
    }, client)
  }

  async run ({ t, author, channel }, statusCode = 200) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(`https://httpstatusdogs.com/img/${Math.round(statusCode)}.jpg`)
    )
  }
}
