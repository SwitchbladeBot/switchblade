// const { Command, SwitchbladeEmbed, Constants } = require('../../')
// const booru = require('booru')

// module.exports = class E621 extends Command {
//   constructor (client) {
//     super(client)
//     this.name = 'e621'
//     this.aliases = ['yiff']
//   }

//   async run (message, t) {
//     message.channel.startTyping()
//     const embed = new SwitchbladeEmbed(message.author)
//     if (message.channel.nsfw) {
//       const [ image ] = await booru.search('e621.net', ['rating:e'], {limit: 1, random: true}).then(booru.commonfy)
//       embed.setImage(image.common.file_url)
//       embed.setDescription(`${t('commands:e621.hereIsYour_yiff')}`)
//       embed.setColor(Constants.E621_COLOR)
//     } else {
//       embed.setColor(Constants.ERROR_COLOR)
//       embed.setTitle(t('errors:nsfwOnly'))
//     }
//     message.channel.send(embed).then(() => message.channel.stopTyping())
//   }
// }


const { Command, SwitchbladeEmbed, Constants } = require('../../')
const booru = require('booru')

module.exports = class E621 extends Command {
  constructor (client) {
    super(client)
    this.name = 'e621'
    this.aliases = ['yiff']
  }

  async run (message, args, t) {
    message.channel.startTyping()
    const embed = new SwitchbladeEmbed(message.author)
    if (message.channel.nsfw) {
    const [ image ] = await booru.search('e621.net', ['rating:e'], {limit: 1, random: true}).then(booru.commonfy)
    // Embed Yiff
    embed.setImage(image.common.file_url)
    embed.setDescription(t('commands:e621.hereIsYour_yiff'))
    embed.setColor(Constants.E621_COLOR)
  } else {
    // NSFW Error
    embed.setDescription(t('errors:nsfwOnly'))
    embed.setColor(Constants.ERROR_COLOR)
  }
  message.channel.send(embed).then(() => message.channel.stopTyping())
}
}

