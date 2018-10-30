const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const booru = require('booru')

module.exports = class Hentai extends Command {
  constructor (client) {
    super(client)
    this.name = 'hentai'
    this.aliases = ['animeporn']
    this.category = 'nsfw'

    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const [ image ] = await booru.search('gelbooru.com', ['rating:explicit'], { limit: 1, random: true }).then(booru.commonfy)
    embed.setImage(image.common.file_url)
      .setTitle(t('commands:hentai.hereIsYourHentai'))
      .setColor(Constants.GELBOORU_COLOR)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
