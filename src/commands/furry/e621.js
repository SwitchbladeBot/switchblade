const { Command, SwitchbladeEmbed, Constants } = require('../../')
const booru = require('booru')

module.exports = class E621 extends Command {
  constructor (client) {
    super(client)
    this.name = 'e621'
    this.aliases = ['yiff']
  }

  async run (message) {
    message.channel.startTyping()
    const embed = new SwitchbladeEmbed(message.author)
    if (message.channel.nsfw) {
      booru.search('e621.net', ['rating:e'], {limit: 1, random: true})
        .then(booru.commonfy)
        .then(images => {
          for (let image of images) {
            embed.setImage(image.common.file_url)
            embed.setDescription('Here\'s your yiff!')
          }
        })
    } else {
      embed.setColor(Constants.ERROR_COLOR)
      embed.setTitle('You need to use this command in a NSFW channel')
      embed.setDescription(`**Usage:** ${process.env.PREFIX}${this.name}`)
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
