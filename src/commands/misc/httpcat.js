const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class HttpCat extends Command {
  constructor (client) {
    super({
      name: 'httpcat',
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
        .setImage(`https://http.cat/${Math.round(statusCode)}`)
    )
  }
}
