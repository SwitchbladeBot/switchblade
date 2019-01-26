const { Command, SwitchbladeEmbed } = require('../../')
const { Attachment } = require('discord.js')
const snekfetch = require('snekfetch')
const { createCanvas } = require('canvas')

module.exports = class UIGradient extends Command {
  constructor (client) {
    super(client)
    this.name = 'uigradient'
    this.aliases = ['rg', 'randomgradient']
    this.category = 'general'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const { body } = await snekfetch.get('https://cdn.jsdelivr.net/gh/ghosh/uiGradients/gradients.json')
    const { name, colors } = body[Math.floor(Math.random() * body.length)]
    const WIDTH = 300
    const HEIGHT = 100
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')
    const grd = ctx.createLinearGradient(0, 0, WIDTH, 0)

    colors.forEach((color, i) => {
      grd.addColorStop((i / (colors.length - 1)), color)
    })

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    embed.setTitle(name)
      .setURL(`https://uigradients.com/#${name.replace(' ', '')}`)
      .setColor(colors[0])
      .setImage('attachment://gradient.png')
      .setDescription(`\`${colors.join(`\`, \``)}\``)
      .attachFile(new Attachment(canvas.toBuffer(), 'gradient.png'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
