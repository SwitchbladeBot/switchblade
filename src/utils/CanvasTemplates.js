const Constants = require('./Constants')
const { ALIGN, measureText } = require('./CanvasUtils.js')
const Color = require('./Color.js')

const { createCanvas, Image, Canvas: { createSVGCanvas } } = require('canvas')
const GIFEncoder = require('gifencoder')
const moment = require('moment')

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day

module.exports = class CanvasTemplates {
  static async profile ({ t, client }, user, userDocument) {
    const WIDTH = 800
    const HEIGHT = 600
    const BORDER = 25

    const FONTS = (() => {
      const MEME = Math.random() > 0.99 ? '"Comic Sans MS"' : null
      const STRONG = MEME || '"Montserrat Black"'
      const REGULAR = MEME || '"Montserrat"'
      return {
        BRAND: `italic 29px ${STRONG}`,
        BALANCE_LABEL: `29px ${REGULAR}`,
        BALANCE_VALUE: `bold 39px ${REGULAR}`,
        USERNAME: `bold 44px ${REGULAR}`,
        DISCRIMINATOR: `bold 20px ${REGULAR}`,
        DESCRIPTION: `18px ${REGULAR}`
      }
    })()

    const IMAGE_ASSETS = Promise.all([
      Image.from(user.displayAvatarURL.replace('.gif', '.png')),
      Image.buffer(Constants.COINS_SVG, true),
      Image.buffer(Constants.DAILY_CLOCK_SVG, true),
      Image.from(Constants.DEFAULT_BACKGROUND_PNG, true)
    ])

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const { lastDaily, money, personalText, favColor } = userDocument
    const favoriteColor = new Color(favColor)
    const colorInvert = favoriteColor.colorInvert.rgba(true)

    // Background gradient
    const gradientColor = (a) => favoriteColor.setAlpha(a).rgba(true)

    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grd.addColorStop(0, gradientColor(0))
    grd.addColorStop(0.35, gradientColor(0))
    grd.addColorStop(0.6, gradientColor(0.8))
    grd.addColorStop(1, gradientColor(0.9))
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Profile picture shadow
    const PROFPIC_SIZE = 275
    const PROFPIC_HALF = PROFPIC_SIZE * 0.5

    ctx.shadowColor = 'black'
    ctx.shadowBlur = 10
    ctx.circle(BORDER + PROFPIC_HALF, 105 + PROFPIC_HALF, PROFPIC_HALF, 0, Math.PI * 2)
    ctx.shadowBlur = 0

    // Text
    ctx.fillStyle = 'white'

    // SWITCHBLADE text
    ctx.write('SWITCHBLADE', WIDTH - BORDER, BORDER, FONTS.BRAND, ALIGN.TOP_RIGHT)

    // Balance info
    ctx.fillStyle = colorInvert

    const TL = moment.duration(Math.max(DAILY_INTERVAL - (Date.now() - lastDaily), 0)).format('h[h] m[m] s[s]')
    const balanceX = WIDTH - Math.max(
      measureText(ctx, FONTS.BALANCE_VALUE, TL).width,
      measureText(ctx, FONTS.BALANCE_LABEL, 'Next reward in').width
    ) - BORDER

    const timeLeft = ctx.write(TL, balanceX, HEIGHT - BORDER, FONTS.BALANCE_VALUE)
    const timeLeftLabel = ctx.write('Next reward in', balanceX, timeLeft.topY - 10, FONTS.BALANCE_LABEL)

    const coins = ctx.write(money, balanceX, timeLeftLabel.topY - 40, FONTS.BALANCE_VALUE)
    ctx.write('Switchcoins', balanceX, coins.topY - 10, FONTS.BALANCE_LABEL)

    const iconSize = timeLeft.height + timeLeftLabel.height + 10
    const iconX = balanceX - 70

    // User info
    const userInfoY = 105 + PROFPIC_SIZE + 25
    const usernameY = ctx.writeParagraph(user.username, FONTS.USERNAME, BORDER, userInfoY, iconX - BORDER, userInfoY + 30).bottomY
    const discriminatorY = ctx.write(`#${user.discriminator}`, BORDER, usernameY + 15, FONTS.DISCRIMINATOR, ALIGN.TOP_LEFT).bottomY

    // Description
    ctx.writeParagraph(personalText, FONTS.DESCRIPTION, BORDER, discriminatorY + 10, iconX - BORDER, HEIGHT - BORDER)

    // Image handling
    const [ avatarImage, coinsImage, clockImage, backgroundImage ] = await IMAGE_ASSETS
    ctx.roundImage(avatarImage, BORDER, 105, PROFPIC_SIZE, PROFPIC_SIZE)

    const coinsSVG = await createSVGCanvas(coinsImage.toString().replace(/\$COLOR/g, colorInvert), 246, 246)
    ctx.drawImage(coinsSVG, iconX, coins.bottomY - iconSize, iconSize, iconSize)
    const clockSVG = await createSVGCanvas(clockImage.toString().replace(/\$COLOR/g, colorInvert), 246, 246)
    ctx.drawImage(clockSVG, iconX, timeLeft.bottomY - iconSize, iconSize, iconSize)

    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT)

    return canvas.toBuffer()
  }

  static async triggered (user) {
    const WIDTH = 256
    const HEIGHT = 256

    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.TRIGGERED_LABEL_PNG, true),
      Image.from(user.displayAvatarURL.replace('.gif', '.png'))
    ])

    const encoder = new GIFEncoder(WIDTH, HEIGHT)
    encoder.start()
    encoder.setRepeat(0) // Repeat
    encoder.setDelay(50) // 50ms delay between frames

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const [ triggeredLabel, avatarImage ] = await IMAGE_ASSETS

    const AVATAR_RANDOM_MAX = 20
    const LABEL_RANDOM_MAX = 10
    const random = (max) => Math.floor(Math.random() * max) - max
    for (let i = 0; i < 8; i++) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(avatarImage, random(AVATAR_RANDOM_MAX), random(AVATAR_RANDOM_MAX), WIDTH + AVATAR_RANDOM_MAX, HEIGHT + AVATAR_RANDOM_MAX)
      ctx.fillStyle = '#FF000033'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(triggeredLabel, random(LABEL_RANDOM_MAX), HEIGHT - 54 + random(LABEL_RANDOM_MAX), 256 + LABEL_RANDOM_MAX, 54 + LABEL_RANDOM_MAX)
      encoder.addFrame(ctx)
    }

    encoder.finish()

    return encoder.out.getData()
  }
}
