const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class XKCD37 extends Command {
  constructor (client) {
    super(client, {
      name: 'xkcd37',
      parameters: [{
        type: 'string', full: true
      }]
    })
  }

  // Context: https://xkcd.com/37/

  async run ({ author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    embed.setTitle(text.replace(/(\w+?)(?!\\)+(-ass)(\s+)(\S+?)/g, '$1$3ass-$4').replace(/\\-/g, '-'))
    channel.send(embed)
  }
}
