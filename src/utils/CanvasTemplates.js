const Constants = require('./Constants')
const { ALIGN, measureText } = require('./CanvasUtils.js')
const Color = require('./Color.js')

const { createCanvas, Image, Canvas: { createSVGCanvas } } = require('canvas')
const GIFEncoder = require('gifencoder')
const moment = require('moment')

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day

module.exports = class CanvasTemplates {
  static async profile ({ t }, user, userDocument) {
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

  static async nowPlaying ({ t }, guildPlayer, song) {
    // const WIDTH = 670
    // const HEIGHT = 215
    const WIDTH = 800
    const HEIGHT = 257

    // const THUMBNAIL_WIDTH = 220
    // let THUMBNAIL_HEIGHT = 215
    const THUMBNAIL_WIDTH = 263
    let THUMBNAIL_HEIGHT = HEIGHT

    const IMAGE_ASSETS = Promise.all([
      Image.from(song.artwork || Constants.DEFAULT_SONG_PNG, !song.artwork)
    ])

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Timebar
    const TIMEBAR_HEIGHT = 6
    // Full timebar
    const FULL_COLOR = '#504F4F'
    const FULL_WIDTH = WIDTH - THUMBNAIL_WIDTH
    ctx.fillStyle = FULL_COLOR
    ctx.fillRect(THUMBNAIL_WIDTH, HEIGHT - TIMEBAR_HEIGHT, FULL_WIDTH, TIMEBAR_HEIGHT)
    // Elapsed timebar
    const ELAPSED_WIDTH = guildPlayer.state.position / song.length * FULL_WIDTH
    ctx.fillStyle = song.color
    ctx.fillRect(THUMBNAIL_WIDTH, HEIGHT - TIMEBAR_HEIGHT, ELAPSED_WIDTH, TIMEBAR_HEIGHT)

    // Text
    ctx.fillStyle = '#FFFFFF'
    const LEFT_TEXT_MARGIN = THUMBNAIL_WIDTH + 8
    const RIGHT_TEXT_MARGIN = WIDTH - 8

    // Time info
    const TIME_Y = HEIGHT - TIMEBAR_HEIGHT - 8
    const TIME_FONT = '16px "Montserrat Medium"'
    const formatTime = (t) => moment.duration(t).format('hh:mm:ss', { stopTrim: 'm' })
    // Elapsed time
    const TIME_ELAPSED = formatTime(guildPlayer.state.position)
    const elapsed = ctx.write(TIME_ELAPSED, LEFT_TEXT_MARGIN, TIME_Y, TIME_FONT, ALIGN.BOTTOM_LEFT)
    // Total time
    const TIME_TOTAL = formatTime(song.length)
    ctx.write(TIME_TOTAL, RIGHT_TEXT_MARGIN, TIME_Y, TIME_FONT, ALIGN.BOTTOM_RIGHT)

    // Author
    const AUTHOR_FONT = 'italic 22px Montserrat'
    const AUTHOR_Y = elapsed.topY - 30
    const author = ctx.writeParagraph(song.author, AUTHOR_FONT, LEFT_TEXT_MARGIN, AUTHOR_Y, RIGHT_TEXT_MARGIN, AUTHOR_Y + 1)
    // Title
    const TITLE_FONT = 'italic 34px "Montserrat Black"'
    const TITLE_Y = author.topY - 34
    ctx.writeParagraph(song.title, TITLE_FONT, LEFT_TEXT_MARGIN, TITLE_Y, RIGHT_TEXT_MARGIN, TITLE_Y + 1)

    // Image handling
    const [ artworkImage ] = await IMAGE_ASSETS

    // Thumbnail
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
    THUMBNAIL_HEIGHT = artworkImage.height * (THUMBNAIL_WIDTH / artworkImage.width)
    ctx.drawImage(artworkImage, 0, HEIGHT * 0.5 - THUMBNAIL_HEIGHT * 0.5, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)

    // Background
    ctx.globalCompositeOperation = 'destination-over'

    const realColor = new Color('#000')
    const gradientColor = (a) => realColor.setAlpha(a).rgba(true)

    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grd.addColorStop(0, gradientColor(0))
    grd.addColorStop(1, gradientColor(0.9))
    ctx.fillStyle = grd
    ctx.fillRect(THUMBNAIL_WIDTH, 0, WIDTH - THUMBNAIL_WIDTH, HEIGHT)

    ctx.drawBlurredImage(artworkImage, 10, THUMBNAIL_WIDTH, 0, WIDTH - THUMBNAIL_WIDTH, HEIGHT)

    // Modal style
    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(0, 0, WIDTH, HEIGHT, 10, true)

    return canvas.toBuffer()
  }

  static async triggered (user) {
    const WIDTH = 256
    const HEIGHT = 310

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
      ctx.drawImage(avatarImage, random(AVATAR_RANDOM_MAX), random(AVATAR_RANDOM_MAX), WIDTH + AVATAR_RANDOM_MAX, HEIGHT - 54 + AVATAR_RANDOM_MAX)
      ctx.fillStyle = '#FF000033'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(triggeredLabel, random(LABEL_RANDOM_MAX), HEIGHT - 54 + random(LABEL_RANDOM_MAX), 256 + LABEL_RANDOM_MAX, 54 + LABEL_RANDOM_MAX)
      encoder.addFrame(ctx)
    }

    encoder.finish()

    return encoder.out.getData()
  }
}
