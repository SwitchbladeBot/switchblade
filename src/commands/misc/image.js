const { Command, CommandError } = require('../../')

module.exports = class ImageSearchCommand extends Command {
  constructor (client) {
    super({
      name: 'image',
      aliases: ['googleimage', 'gogleimage', 'imagesearch', 'images', 'gimages'],
      requirements: { apis: ['gsearch'] },
      category: 'general',
      parameters: [{
        type: 'string', required: true, full: true, missingError: 'commands:image.noQuery'
      }]
    }, client)
  }

  async run ({ t, channel }, query) {
    try {
      const image = await this.client.apis.gsearch.searchImage(query)
      if (image.items) {
        return channel.send(image.items[0].link)
      } else {
        throw new CommandError(t('commons:search.noResults'))
      }
    } catch (err) {
      if (err instanceof CommandError) throw err
      throw new CommandError(t('errors:generic'))
    }
  }
}
