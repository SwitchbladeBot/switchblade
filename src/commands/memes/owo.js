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
    // If theres something to owoify, it gonna return, else, not.
    if (args.join(' ') > 0) {
      message.channel.startTyping()
      const { body } = await snekfetch.get(OWOapi + args.join(' '))
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setTitle(body.owo)
      ).then(() => message.channel.stopTyping())
    } else {
      embed
        .setColor(this.client.colors.error)
        .setTitle('You need to give me something to owoify')
        .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <sentence>`)
    }
  }
}
