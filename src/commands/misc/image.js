const { Command, CommandError } = require('../../')

module.exports = class ImageSearchCommand extends Command {
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
    try {
      const image = await this.client.apis.gsearch.searchImage(query)
      channel.send(image.items[0].link)
    } catch (err) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
