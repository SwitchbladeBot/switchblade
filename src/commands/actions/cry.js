const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class Cry extends Command {
  constructor (client) {
    super(client)
    this.name = 'cry'
    this.category = 'actions'
    this.requirements = new CommandRequirements(this, { apis: ['giphy'] })
  }

  async run ({ t, channel, author }) {
    const giphyResponse = await this.client.apis.giphy.getRandomGIF('cry')
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(giphyResponse.data.image_original_url)
        .setDescription(t('commands:cry.hasStartedCrying', { author }))
    )
  }
}
