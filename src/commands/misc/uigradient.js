const { Command, SwitchbladeEmbed, CanvasTemplates } = require('../../')
const { Attachment } = require('discord.js')
const fetch = require('node-fetch')

module.exports = class UIGradient extends Command {
  constructor (client) {
    super(client, {
      name: 'uigradient',
      aliases: ['rg', 'randomgradient']
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const body = await fetch('https://cdn.jsdelivr.net/gh/ghosh/uiGradients/gradients.json').then(res => res.json())
    const { name, colors } = body[Math.floor(Math.random() * body.length)]

    const gradient = CanvasTemplates.gradient(colors, 300, 100)

    embed.setTitle(name)
      .setURL(`https://uigradients.com/#${name.replace(/\s+/g, '')}`)
      .setColor(colors[0])
      .setImage('attachment://gradient.png')
      .setDescription(`\`${colors.join(`\`, \``)}\``)
      .attachFile(new Attachment(gradient, 'gradient.png'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
