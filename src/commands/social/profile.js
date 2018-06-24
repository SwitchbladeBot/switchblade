const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const { Attachment } = require('discord.js')
const { createCanvas, Image } = require('canvas')

// Constants
const WIDTH = 1239
const HEIGHT = 680

module.exports = class Profile extends Command {
  constructor (client) {
    super(client)
    this.name = 'profile'
    this.aliases = []

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true, required: false})
    )
  }

  async run ({ t, author, channel }, user) {
    user = user || author
    channel.startTyping()
    const profile = await this.drawProfile(t, user)
    channel.send(new Attachment(profile, 'profile.jpg')).then(() => channel.stopTyping())
  }

  async drawProfile (t, user) {
    const { lastDaily, money } = await this.client.database.users.get(user.id)

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Background
    const profBg = await Image.from(user.displayAvatarURL)
    ctx.drawImage(profBg, 0, 0, WIDTH, HEIGHT)

    // Background gradient
    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grd.addColorStop(0, 'transparent')
    grd.addColorStop(0.3, 'rgba(114, 137, 218, 0.6)')
    grd.addColorStop(0.4, 'rgba(114, 137, 218, 0.7)')
    grd.addColorStop(0.5, 'rgba(114, 137, 218, 0.8)')
    grd.addColorStop(0.6, 'rgba(114, 137, 218, 0.95)')
    grd.addColorStop(1, 'rgba(114, 137, 218, 0.95)')

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Profile picture
    const profPic = await Image.from(user.displayAvatarURL)
    ctx.roundImage(profPic, 26, 106, 275, 275)

    // Test text
    ctx.font = '15px "Montserrat"';
    ctx.fillText('Teste', 150, 150);

    return canvas.toBuffer()
  }
}
