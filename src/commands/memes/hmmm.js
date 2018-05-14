const { Command } = require('../../')
const request = require('snekfetch')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)

    this.name = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
  }

  run (message) {
    let embed = this.client.getDefaultEmbed(message.author)
    request.get('https://reddit.com/r/hmmm/random/.json').then(req => {
      let res = req.body[0].data.children[0].data
      embed.setImage(res.url)
      embed.setTitle('hmmm')
      embed.setURL(`https://reddit.com${res.permalink}`)
      message.channel.send({embed})
    })
  }
}
