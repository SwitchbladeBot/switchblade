const { Command } = require('../../')

module.exports = class Goat extends Command {
  constructor (client) {
    super({
      name: 'image',
      aliases: ['googleimage', 'gogleimage', 'imagesearch', 'images', 'gimages'],
      category: 'general',
      parameters: [{
        type: 'string', required: true, full: true, missingError: 'commands:image.noQuery'
      }]
    }, client)
  }

  async run ({ channel }, query) {
    const image = await this.client.apis.gsearch.searchImage(query)
    channel.send(image.items[0].link)
  }
}
