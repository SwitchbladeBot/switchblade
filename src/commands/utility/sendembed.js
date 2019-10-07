const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class SendEmbed extends Command {
  constructor (client) {
    super(client, {
      name: 'sendembed',
      aliases: ['embed'],
      category: 'utility',
      parameters: [{
        type: 'string', full: true, required: false
      }, [{
        type: 'string', name: 'title', aliases: ['t']
      }, {
        type: 'string', name: 'description', aliases: ['d']
      }, {
        type: 'string', name: 'color', aliases: ['c']
      }]]
    })
  }

  run ({ t, author, channel, flags }, data) {
    let embed = new SwitchbladeEmbed({data: JSON.parse(data)})
    if (flags.title) embed.setTitle(flags.title)
    if (flags.description) embed.setDescription(flags.description)
    if (flags.color) embed.setColor(flags.color)
    channel.send(embed)
  }
}
