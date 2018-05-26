const { Command, SwitchbladeEmbed, Constants } = require('../../')
const snekfetch = require('snekfetch')
const OWOapi = 'https://nekos.life/api/v2/owoify?text='

module.exports = class OwO extends Command {
  constructor (client) {
    super(client)
    this.name = 'owo'
    this.aliases = ['uwu', 'whatsthis', 'owoify']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (args.length > 0) {
      const { body } = await snekfetch.get(OWOapi + args.join(' '))
      embed.setTitle(body.owo)
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('You need to give me a sentence to owoify')
        .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <sentence>`)
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
