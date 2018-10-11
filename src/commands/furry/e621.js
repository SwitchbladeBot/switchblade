const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const booru = require('booru')

module.exports = class E621 extends Command {
  constructor (client) {
    super(client)
    this.name = 'e621'
    this.aliases = ['yiff']
    this.category = 'nsfw'

    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const [ image ] = await booru.search('e621.net', ['rating:e'], { limit: 1, random: true }).then(booru.commonfy)
    embed.setImage(image.common.file_url)
      .setDescription(t('commands:e621.hereIsYour_yiff'))
      .setColor(Constants.E621_COLOR)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
