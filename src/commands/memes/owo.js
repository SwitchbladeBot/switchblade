const { Command, SwitchbladeEmbed } = require('../../')
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
    if (args.length > 0) {
      message.channel.startTyping()
      const { body } = await snekfetch.get(OWOapi + args.join(' '))
      embed.setTitle(body.owo)
    } else {
      message.channel.startTyping()
      embed.setColor(this.client.colors.error)
      embed.setTitle('You need to give me a sentence to owoify')
      embed.setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <sentence>`)
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
