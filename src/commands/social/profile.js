const { CommandStructures, Constants } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const { Attachment } = require('discord.js')
const { createCanvas, Image } = require('canvas')
const prettyMs = require('pretty-ms')

// Constants
const WIDTH = 1239
const HEIGHT = 679

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
    const profBg = await Image.from('https://i.imgur.com/mM3puy3.jpg')
    ctx.drawImage(profBg, 0, 0, WIDTH, HEIGHT)

    // Background gradient
    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grd.addColorStop(0, 'rgba(114, 137, 218, 0)')
    grd.addColorStop(0.35, 'rgba(114, 137, 218, 0)')
    grd.addColorStop(0.6, 'rgba(114, 137, 218, 0.8)')
    grd.addColorStop(1, 'rgba(114, 137, 218, 0.9)')

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, WIDTH, HEIGHT)


    // Profile picture
    const PROFPIC_SIZE = 275
    const PROFPIC_HALF = PROFPIC_SIZE * 0.5

    ctx.shadowColor = 'black'
    ctx.shadowBlur = 10
    ctx.circle(26 + PROFPIC_HALF, 106 + PROFPIC_HALF, PROFPIC_HALF, 0, Math.PI * 2)
    ctx.shadowBlur = 0

    const avatarURL = user.displayAvatarURL.replace('.gif', '.png')
    const profPic = await Image.from(avatarURL)
    ctx.roundImage(profPic, 26, 106, PROFPIC_SIZE, PROFPIC_SIZE)


    // Text
    ctx.fillStyle = 'white'

    // Username
    ctx.font = '44px "Montserrat Black"'
    ctx.fillText(user.username, 22, 442)

    // Discriminator
    ctx.font = '20px "Montserrat SemiBold"'
    ctx.fillText(`#${user.discriminator}`, 26, 474)

    // Description
    ctx.font = '26px "Montserrat Black"'
    ctx.fillText('Description:', 24, 504)


    // Balance info
    ctx.drawImage(await Image.from(Constants.COINS_PNG, true), 890, 480, 70, 70)
    ctx.font = '29px "Montserrat"'
    ctx.fillText('Switchcoins', 972, 508)
    ctx.font = '39px "Montserrat Black"'
    ctx.fillText(money, 972, 545)

    const time = prettyMs(parseInt((Date.now() - (lastDaily + 86400000)) * -1), { secDecimalDigits: 0 })
    ctx.drawImage(await Image.from(Constants.DAILY_CLOCK_PNG, true), 890, 585, 70, 70)
    ctx.font = '29px "Montserrat"'
    ctx.fillText('Time Left to daily', 972, 612)
    ctx.font = '39px "Montserrat Black"'
    ctx.fillText(time, 972, 651)
    
    return canvas.toBuffer()
  }
}
