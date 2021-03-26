const Constants = require('./Constants')
const Color = require('./Color.js')

const GIFEncoder = require('gifencoder')
const moment = require('moment')
const { loadImage } = require('canvas')

let Canvas = {}
let CanvasUtils = {}
try {
  Canvas = require('canvas')
  CanvasUtils = require('./CanvasUtils.js')
} catch (e) {}

const { createCanvas, Image } = Canvas
const { ALIGN, measureText } = CanvasUtils

module.exports = class CanvasTemplates {
  static async profile ({ t }, user, userDocument, role) {
    const WIDTH = 640
    const HEIGHT = 600

    const AVATAR_SIZE = 178

    const INNER_MARGIN = 20

    const FONTS = (() => {
      const MEME = Math.random() > 0.99 && '"Comic Sans MS"'
      const EXTRABOLD = MEME || '"Montserrat ExtraBold"'
      const REGULAR = MEME || '"Montserrat"'
      const LIGHT = MEME || '"Montserrat Light"'
      return {
        USERNAME: `bold 29px ${REGULAR}`,
        DISCRIMINATOR: `20px ${LIGHT}`,
        TAG_LABEL: `16px ${EXTRABOLD}`,
        XP_LABEL: `bold 16px ${REGULAR}`,
        INFO_LABEL: `23px ${REGULAR}`,
        INFO_VALUE: `28px ${EXTRABOLD}`,
        ABOUT_LABEL: `25px ${EXTRABOLD}`,
        ABOUT_VALUE: `16px ${REGULAR}`
      }
    })()

    const { rep, money, personalText, favColor } = userDocument
    const IMAGE_ASSETS = Promise.all([
      Image.from(user.displayAvatarURL({ format: 'png' })),
      Image.from(Constants.COINS_SVG, true),
      Image.from(Constants.REPUTATION_SVG, true),
      Image.from(Constants.DEFAULT_BACKGROUND_PNG, true)
    ])

    const FAVCOLOR = new Color(favColor)
    const TEXTCOLOR = '#FFF'

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Card drawing
    //   Darker rectangle
    const CARD_MARGIN = 200
    ctx.fillStyle = 'rgba(29, 29, 29, 0.94)'
    ctx.fillRect(0, CARD_MARGIN, WIDTH, HEIGHT - CARD_MARGIN)
    //   Brighter rectangle
    const BRIGHTER_HEIGHT = 110
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)' // #FFFFFF1A
    ctx.fillRect(0, CARD_MARGIN, WIDTH, BRIGHTER_HEIGHT)

    // Profile
    ctx.fillStyle = TEXTCOLOR
    const PROFILE_X = INNER_MARGIN * 2 + AVATAR_SIZE
    const PROFILE_Y = CARD_MARGIN + BRIGHTER_HEIGHT * 0.5
    //   Username
    ctx.write(user.username, PROFILE_X, PROFILE_Y, FONTS.USERNAME, ALIGN.BOTTOM_LEFT)
    //   Discriminator
    ctx.write(`#${user.discriminator}`, PROFILE_X, PROFILE_Y + 10, FONTS.DISCRIMINATOR, ALIGN.TOP_LEFT)
    //   Tags
    if (role) {
      const TAG_NAME = role.name.toUpperCase()
      const TAG_MARGIN = 20
      const TAG_NAME_WIDTH = measureText(ctx, FONTS.TAG_LABEL, TAG_NAME).width
      const TAG_HEIGHT = 34
      const TAG_Y = CARD_MARGIN

      const TAG_COLOR = new Color(role.hexColor)
      ctx.fillStyle = TAG_COLOR.rgba(true)
      ctx.roundRect(PROFILE_X, TAG_Y - (TAG_HEIGHT * 0.5), TAG_NAME_WIDTH + TAG_MARGIN * 2, TAG_HEIGHT, TAG_HEIGHT * 0.5, true)
      ctx.fillStyle = TAG_COLOR.colorInvert.rgba(true)
      ctx.write(TAG_NAME, PROFILE_X + TAG_MARGIN, TAG_Y, FONTS.TAG_LABEL, ALIGN.CENTER_LEFT)
    }

    // XP
    //   XP Label
    const XP_LABEL_RADIUS = 18
    const XP_X = WIDTH - INNER_MARGIN - XP_LABEL_RADIUS
    const XP_Y = CARD_MARGIN + BRIGHTER_HEIGHT
    ctx.fillStyle = '#151515'
    ctx.circle(XP_X, XP_Y, XP_LABEL_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = TEXTCOLOR
    ctx.write('XP', XP_X, XP_Y, FONTS.XP_LABEL, ALIGN.CENTER)
    //   XP Bar
    ctx.fillStyle = '#151515'
    const XP_BAR_HEIGHT = 13
    const XP_BAR_WIDTH = WIDTH - INNER_MARGIN * 2 - INNER_MARGIN * 0.5 - XP_LABEL_RADIUS * 2
    ctx.roundRect(INNER_MARGIN, XP_Y - XP_BAR_HEIGHT * 0.5, XP_BAR_WIDTH, XP_BAR_HEIGHT, XP_BAR_HEIGHT * 0.5, true)
    //   XP Bar current
    ctx.fillStyle = FAVCOLOR.rgba(true)
    ctx.roundRect(INNER_MARGIN, XP_Y - XP_BAR_HEIGHT * 0.5, XP_BAR_WIDTH * 0.5, XP_BAR_HEIGHT, XP_BAR_HEIGHT * 0.5, true)

    // Sections
    const SECTION_INNER_MARGIN = 16
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)' // #FFFFFF1A
    ctx.fillStyle = TEXTCOLOR
    //   Info sections
    const INFO_WIDTH = (WIDTH - INNER_MARGIN * 3) * 0.5
    const INFO_HEIGHT = 82
    const INFO_Y = HEIGHT - INNER_MARGIN - INFO_HEIGHT

    const ICON_SIZE = 50
    const ICON_Y = INFO_Y + INFO_HEIGHT * 0.5 - ICON_SIZE * 0.5

    //     Switchcoins
    const COINS_X = INNER_MARGIN + SECTION_INNER_MARGIN
    const COINS_TEXT_X = COINS_X + SECTION_INNER_MARGIN + ICON_SIZE - 7
    const COINS_TEXT_Y = INFO_Y + INFO_HEIGHT * 0.5
    ctx.roundRect(INNER_MARGIN, INFO_Y, INFO_WIDTH, INFO_HEIGHT, 10, false, true)
    ctx.write(t('commons:currency_plural'), COINS_TEXT_X, COINS_TEXT_Y - 5, FONTS.INFO_LABEL, ALIGN.BOTTOM_LEFT)
    ctx.write(money, COINS_TEXT_X, COINS_TEXT_Y + 5, FONTS.INFO_VALUE, ALIGN.TOP_LEFT)

    //     Reputation
    const REP_X = WIDTH - INNER_MARGIN - INFO_WIDTH
    const REP_TEXT_X = REP_X + SECTION_INNER_MARGIN + ICON_SIZE + 7
    const REP_TEXT_Y = INFO_Y + INFO_HEIGHT * 0.5
    ctx.roundRect(REP_X, INFO_Y, INFO_WIDTH, INFO_HEIGHT, 10, false, true)
    ctx.write(t('commons:reputation'), REP_TEXT_X, REP_TEXT_Y - 5, FONTS.INFO_LABEL, ALIGN.BOTTOM_LEFT)
    ctx.write(rep, REP_TEXT_X, REP_TEXT_Y + 5, FONTS.INFO_VALUE, ALIGN.TOP_LEFT)

    //   About section
    const ABOUT_WIDTH = WIDTH - INNER_MARGIN * 2
    const ABOUT_HEIGHT = 132
    const ABOUT_Y = INFO_Y - INNER_MARGIN - ABOUT_HEIGHT
    ctx.roundRect(INNER_MARGIN, ABOUT_Y, ABOUT_WIDTH, ABOUT_HEIGHT, 10, false, true)

    const about = ctx.write(t('commands:profile.aboutMe'), SECTION_INNER_MARGIN * 2, ABOUT_Y + SECTION_INNER_MARGIN, FONTS.ABOUT_LABEL, ALIGN.TOP_LEFT)
    ctx.writeParagraph(
      personalText,
      FONTS.ABOUT_VALUE,
      about.leftX,
      about.bottomY + INNER_MARGIN * 0.5,
      WIDTH - INNER_MARGIN * 2,
      ABOUT_Y + ABOUT_HEIGHT - INNER_MARGIN
    )

    // Image handling
    const [avatarImage, coinsImage, repImage, backgroundImage] = await IMAGE_ASSETS

    const AVATAR_HALF = AVATAR_SIZE * 0.5
    const AVATAR_Y = CARD_MARGIN - (AVATAR_SIZE * 0.5)
    //   Avatar shadow
    ctx.save()
    ctx.fillStyle = '#00000099'
    ctx.shadowColor = '#00000099'
    ctx.shadowBlur = 10
    ctx.circle(INNER_MARGIN + AVATAR_HALF, AVATAR_Y + AVATAR_HALF, AVATAR_HALF, 0, Math.PI * 2)
    ctx.restore()
    //   Avatar
    ctx.roundImage(avatarImage, INNER_MARGIN, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE)

    //   Info section
    ctx.drawIcon(coinsImage, COINS_X, ICON_Y, ICON_SIZE, ICON_SIZE, TEXTCOLOR)
    ctx.drawIcon(repImage, REP_X + SECTION_INNER_MARGIN, ICON_Y, ICON_SIZE, ICON_SIZE, TEXTCOLOR)

    //   Background image
    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT)

    // Modal
    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(0, 0, WIDTH, HEIGHT, 10, true)

    return canvas.toBuffer()
  }

  static async nowPlaying ({ t }, guildPlayer, song) {
    const WIDTH = 800
    const HEIGHT = 257

    const THUMBNAIL_WIDTH = 263
    let THUMBNAIL_HEIGHT = HEIGHT

    const IMAGE_ASSETS = Promise.all([
      Image.from(song.mainImage || Constants.DEFAULT_SONG_PNG, !song.mainImage),
      Image.from(song.backgroundImage || Constants.DEFAULT_SONG_PNG, !song.backgroundImage),
      Image.from(Constants[`${song.source.toUpperCase()}_BRAND_SVG`])
    ])

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Timebar
    const TIMEBAR_HEIGHT = 6
    // Full timebar
    const FULL_COLOR = '#504F4F'
    const FULL_WIDTH = WIDTH - THUMBNAIL_WIDTH
    if (!song.isStream) {
      ctx.fillStyle = FULL_COLOR
      ctx.fillRect(THUMBNAIL_WIDTH, HEIGHT - TIMEBAR_HEIGHT, FULL_WIDTH, TIMEBAR_HEIGHT)
    }
    // Elapsed timebar
    const ELAPSED_WIDTH = song.isStream ? FULL_WIDTH : guildPlayer.state.position / song.length * FULL_WIDTH
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
    if (!song.isStream) {
      const TIME_TOTAL = formatTime(song.length)
      ctx.write(TIME_TOTAL, RIGHT_TEXT_MARGIN, TIME_Y, TIME_FONT, ALIGN.BOTTOM_RIGHT)
    } else {
      const LIVE_CIRCLE_RADIUS = 5
      const LIVE_TEXT = t('music:live').toUpperCase()
      const live = ctx.write(LIVE_TEXT, RIGHT_TEXT_MARGIN, TIME_Y, TIME_FONT, ALIGN.BOTTOM_RIGHT)
      ctx.fillStyle = '#FF0000'
      ctx.circle(live.leftX - LIVE_CIRCLE_RADIUS * 2, live.centerY, LIVE_CIRCLE_RADIUS, 0, Math.PI * 2, true)
      ctx.fillStyle = '#FFFFFF'
    }

    // Author
    const AUTHOR_FONT = 'italic 22px Montserrat'
    const AUTHOR_Y = elapsed.topY - 10
    const author = ctx.writeParagraph(song.author, AUTHOR_FONT, LEFT_TEXT_MARGIN, AUTHOR_Y, RIGHT_TEXT_MARGIN, AUTHOR_Y + 1, 5, ALIGN.BOTTOM_LEFT)
    // Title
    const TITLE_FONT = 'italic 34px "Montserrat Black"'
    const TITLE_Y = author.topY - 10
    ctx.writeParagraph(song.title, TITLE_FONT, LEFT_TEXT_MARGIN, TITLE_Y, RIGHT_TEXT_MARGIN, TITLE_Y + 1, 5, ALIGN.BOTTOM_LEFT)

    // Image handling
    const [mainImage, backgroundImage, brand] = await IMAGE_ASSETS

    // Brand
    const BRAND_MARGIN = 12
    const BRAND_SIZE = 44
    ctx.drawIcon(brand, THUMBNAIL_WIDTH + BRAND_MARGIN, BRAND_MARGIN, BRAND_SIZE, BRAND_SIZE, '#fff')

    // Thumbnail
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
    THUMBNAIL_HEIGHT = mainImage.height * (THUMBNAIL_WIDTH / mainImage.width)
    ctx.drawImage(mainImage, 0, HEIGHT * 0.5 - THUMBNAIL_HEIGHT * 0.5, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)

    // Background
    ctx.globalCompositeOperation = 'destination-over'

    const realColor = new Color('#000')
    const gradientColor = (a) => realColor.setAlpha(a).rgba(true)

    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grd.addColorStop(0, gradientColor(0))
    grd.addColorStop(1, gradientColor(0.9))
    ctx.fillStyle = grd
    ctx.fillRect(THUMBNAIL_WIDTH, 0, WIDTH - THUMBNAIL_WIDTH, HEIGHT)

    const bgWidth = WIDTH - THUMBNAIL_WIDTH
    const bgHeight = (bgWidth / backgroundImage.width) * backgroundImage.height
    const bgY = -((bgHeight - HEIGHT) / 2)
    ctx.drawBlurredImage(backgroundImage, 10, THUMBNAIL_WIDTH, bgY, bgWidth, bgHeight)

    // Modal style
    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(0, 0, WIDTH, HEIGHT, 10, true)

    return canvas.toBuffer()
  }

  static async leaderboard ({ t }, top, { icon, iconWidth, iconHeight, title, valueFunction }) {
    const WIDTH = 680
    const HEIGHT = 654

    const CARD_HEIGHT = 590
    const CARD_Y_MARGIN = (HEIGHT - CARD_HEIGHT) * 0.5

    const TOP_AVATAR_SIZE = 134
    const TOP_AVATAR_RADIUS = TOP_AVATAR_SIZE * 0.5
    const OTHERS_AVATAR_SIZE = 72

    const INNER_MARGIN = 25

    const FONTS = (() => {
      const MEME = Math.random() > 0.99 && '"Comic Sans MS"'
      const EXTRABOLD = MEME || '"Montserrat ExtraBold"'
      const REGULAR = MEME || '"Montserrat"'
      const LIGHT = MEME || '"Montserrat Light"'
      return {
        TITLE: `28px ${EXTRABOLD}`,
        TOP_USERNAME: `bold 29px ${REGULAR}`,
        TOP_DISCRIMINATOR: `20px ${LIGHT}`,
        TOP_VALUE: `20px ${LIGHT}`,
        TOP_POSITION: `bold 29px ${REGULAR}`,
        OTHERS_USERNAME: `bold 19px ${REGULAR}`,
        OTHERS_DISCRIMINATOR: `14px ${LIGHT}`,
        OTHERS_VALUE: `14px ${LIGHT}`,
        OTHERS_POSITION: `bold 15px ${REGULAR}`
      }
    })()

    const DEFAULT_AVATAR = Image.from('https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png')

    const avatarCoords = []
    const avatarPictures = top.map(u => Image.from(u.user.displayAvatarURL({ format: 'png' }).replace('?size=2048', '')).catch(() => DEFAULT_AVATAR))
    const IMAGE_ASSETS = Promise.all([
      Image.from(icon, true),
      Image.from(Constants.MEDAL_SVG, true),
      Image.from(Constants.DEFAULT_BACKGROUND_PNG, true),
      ...avatarPictures
    ])

    const TOP_USER = top.shift()
    const TEXTCOLOR = '#FFF'

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Card drawing
    //   Darker rectangle
    const CARD_MARGIN = 102
    ctx.fillStyle = 'rgba(29, 29, 29, 0.94)'
    ctx.fillRect(0, CARD_Y_MARGIN + CARD_MARGIN, WIDTH, CARD_HEIGHT - CARD_MARGIN)
    //   Brighter rectangle
    const BRIGHTER_HEIGHT = 110
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)' // #FFFFFF1A
    ctx.fillRect(0, CARD_Y_MARGIN + CARD_MARGIN, WIDTH, BRIGHTER_HEIGHT)

    // Top user
    ctx.fillStyle = TEXTCOLOR
    const TOP_USER_AVATAR_COORDS = [INNER_MARGIN + TOP_AVATAR_RADIUS, CARD_Y_MARGIN + CARD_MARGIN + INNER_MARGIN]
    const PROFILE_X = INNER_MARGIN * 2 + TOP_AVATAR_SIZE
    const PROFILE_Y = CARD_Y_MARGIN + CARD_MARGIN + BRIGHTER_HEIGHT * 0.5
    //   Username
    const topUsername = ctx.write(TOP_USER.user.username, PROFILE_X, PROFILE_Y, FONTS.TOP_USERNAME, ALIGN.BOTTOM_LEFT)
    //   Discriminator
    ctx.write(`#${TOP_USER.user.discriminator}`, topUsername.rightX, topUsername.bottomY, FONTS.TOP_DISCRIMINATOR, ALIGN.BOTTOM_LEFT)
    //   Value
    ctx.write(valueFunction(TOP_USER), PROFILE_X, PROFILE_Y + 10, FONTS.TOP_VALUE, ALIGN.TOP_LEFT)

    // Others
    const SECTION_INNER_MARGIN = 10
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)' // #FFFFFF1A
    //   Info sections
    const SECTION_WIDTH = (WIDTH - INNER_MARGIN * 3) / 2
    const SECTION_HEIGHT = ((CARD_HEIGHT - CARD_MARGIN - BRIGHTER_HEIGHT) - INNER_MARGIN * 4) / 3
    top.forEach((u, i) => {
      i++
      const SECTION_X = INNER_MARGIN + (i % 2 ? 0 : SECTION_WIDTH + INNER_MARGIN)
      const SECTION_Y = CARD_Y_MARGIN + CARD_MARGIN + BRIGHTER_HEIGHT + INNER_MARGIN + (Math.ceil(i / 2) - 1) * (SECTION_HEIGHT + INNER_MARGIN)
      ctx.roundRect(SECTION_X, SECTION_Y, SECTION_WIDTH, SECTION_HEIGHT, 10, false, true)

      const AVATAR = [
        SECTION_X + SECTION_INNER_MARGIN,
        SECTION_Y + SECTION_INNER_MARGIN
      ]
      avatarCoords.push(AVATAR)

      const USER_X = AVATAR[0] + OTHERS_AVATAR_SIZE + SECTION_INNER_MARGIN
      const USER_Y = SECTION_Y + (SECTION_HEIGHT * 0.5)
      const DISCRIMINATOR_WIDTH = measureText(ctx, FONTS.OTHERS_DISCRIMINATOR, `#${u.user.discriminator}`).width
      //   Username
      const username = ctx.writeParagraph(
        u.user.username,
        FONTS.OTHERS_USERNAME,
        USER_X,
        USER_Y,
        SECTION_X + SECTION_WIDTH - INNER_MARGIN - DISCRIMINATOR_WIDTH,
        USER_Y + 1,
        5,
        ALIGN.BOTTOM_LEFT
      )
      //   Discriminator
      ctx.write(`#${u.user.discriminator}`, username.rightX, username.bottomY, FONTS.OTHERS_DISCRIMINATOR, ALIGN.BOTTOM_LEFT)
      //   Value
      ctx.write(valueFunction(u), USER_X, USER_Y + 10, FONTS.OTHERS_VALUE, ALIGN.TOP_LEFT)
    })

    // Image handling
    const [valueImage, medalImage, backgroundImage, ...avatarImages] = await IMAGE_ASSETS

    const avatarImage = avatarImages.shift()
    //   Top avatar shadow
    const [TOP_USER_AVATAR_X, TOP_USER_AVATAR_Y] = TOP_USER_AVATAR_COORDS
    ctx.save()
    ctx.fillStyle = '#00000099'
    ctx.shadowColor = '#00000099'
    ctx.shadowBlur = 10
    ctx.circle(TOP_USER_AVATAR_X, TOP_USER_AVATAR_Y, TOP_AVATAR_RADIUS, 0, Math.PI * 2)
    ctx.restore()
    //   Avatar
    ctx.roundImage(avatarImage, TOP_USER_AVATAR_X - TOP_AVATAR_RADIUS, TOP_USER_AVATAR_Y - TOP_AVATAR_RADIUS, TOP_AVATAR_SIZE, TOP_AVATAR_SIZE)
    //   Medal
    ctx.fillStyle = '#FFF200'
    const MEDAL_RADIUS = 22
    const MEDAL_X = TOP_USER_AVATAR_X + TOP_AVATAR_RADIUS - MEDAL_RADIUS
    const MEDAL_Y = TOP_USER_AVATAR_Y + TOP_AVATAR_RADIUS - MEDAL_RADIUS
    ctx.circle(MEDAL_X, MEDAL_Y, MEDAL_RADIUS, 0, Math.PI * 2)
    ctx.drawIcon(medalImage, MEDAL_X - 15, MEDAL_Y - 15, 31, 31, '#0000008f')

    // Others avatars
    avatarImages.forEach((avatar, i) => {
      const [avatarX, avatarY] = avatarCoords[i]
      ctx.roundImage(avatar, avatarX, avatarY, OTHERS_AVATAR_SIZE, OTHERS_AVATAR_SIZE)

      const POSITION_RADIUS = 12
      const POSITION_X = avatarX + OTHERS_AVATAR_SIZE - POSITION_RADIUS
      const POSITION_Y = avatarY + OTHERS_AVATAR_SIZE - POSITION_RADIUS
      ctx.fillStyle = '#FFFFFF'
      ctx.circle(POSITION_X, POSITION_Y, POSITION_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = '#000000'
      ctx.write(i + 2, POSITION_X, POSITION_Y, FONTS.OTHERS_POSITION, ALIGN.CENTER)
    })

    //   Background image
    ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(backgroundImage, 0, CARD_Y_MARGIN, WIDTH, CARD_HEIGHT)

    //   Modal
    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(0, CARD_Y_MARGIN, WIDTH, CARD_HEIGHT, 10, true)
    ctx.restore()

    //   Title
    ctx.fillStyle = '#FFFFFF'
    const TITLE_CIRCLE_RADIUS = 32
    const TITLE_X = TITLE_CIRCLE_RADIUS
    const TITLE_Y = CARD_Y_MARGIN
    ctx.circle(TITLE_X, TITLE_Y, TITLE_CIRCLE_RADIUS, 0, Math.PI * 2)

    const TITLE_NAME_WIDTH = measureText(ctx, FONTS.TITLE, title).width
    const TITLE_RECT_INNER_MARGIN = 30
    const TITLE_RECT_WIDTH = TITLE_NAME_WIDTH + TITLE_RECT_INNER_MARGIN * 2 + TITLE_RECT_INNER_MARGIN * 0.5
    const TITLE_RECT_HEIGHT = 42

    ctx.roundRect(TITLE_X, TITLE_Y - TITLE_RECT_HEIGHT * 0.5, TITLE_RECT_WIDTH, TITLE_RECT_HEIGHT, TITLE_RECT_HEIGHT * 0.5, true)

    ctx.drawIcon(valueImage, TITLE_X - iconWidth * 0.5, TITLE_Y - iconHeight * 0.5, iconWidth, iconHeight, '#000000')

    ctx.fillStyle = '#000000'
    ctx.write(title, TITLE_X + TITLE_RECT_INNER_MARGIN * 1.5, TITLE_Y, FONTS.TITLE, ALIGN.CENTER_LEFT)

    return canvas.toBuffer()
  }

  static async triggered (buffer) {
    const WIDTH = 256
    const HEIGHT = 310

    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.TRIGGERED_LABEL_PNG, true),
      Image.from(buffer)
    ])

    const encoder = new GIFEncoder(WIDTH, HEIGHT)
    encoder.start()
    encoder.setRepeat(0) // Repeat
    encoder.setDelay(50) // 50ms delay between frames

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const [triggeredLabel, avatarImage] = await IMAGE_ASSETS

    const BUFFER_RANDOM_MAX = 20
    const LABEL_RANDOM_MAX = 10
    const random = (max) => Math.floor(Math.random() * max) - max
    for (let i = 0; i < 8; i++) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(avatarImage, random(BUFFER_RANDOM_MAX), random(BUFFER_RANDOM_MAX), WIDTH + BUFFER_RANDOM_MAX, HEIGHT - 54 + BUFFER_RANDOM_MAX)
      ctx.fillStyle = '#FF000033'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(triggeredLabel, random(LABEL_RANDOM_MAX), HEIGHT - 54 + random(LABEL_RANDOM_MAX), 256 + LABEL_RANDOM_MAX, 54 + LABEL_RANDOM_MAX)
      encoder.addFrame(ctx)
    }

    encoder.finish()

    return encoder.out.getData()
  }

  static async petpet (buffer) {
    const WIDTH = 112
    const HEIGHT = 112

    const AVATAR_HEIGHT = [94, 82, 76, 82, 94]
    const AVATAR_WIDTH = [94, 98, 106, 102, 98]
    const X_FRAMES = [18, 14, 6, 6, 14]
    const Y_FRAMES = [18, 30, 36, 30, 18]
    const AVATAR_SCALE = 1.1

    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.PETPET_PNG, true),
      Image.from(buffer)
    ])

    const encoder = new GIFEncoder(WIDTH, HEIGHT)
    encoder.start()
    encoder.setRepeat(0) // Repeat
    encoder.setDelay(55) // 55ms delay between frames
    encoder.setTransparent('#000000')

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const [petHand, avatarImage] = await IMAGE_ASSETS

    for (let i = 0; i < 5; i++) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(avatarImage, X_FRAMES[i], Y_FRAMES[i], AVATAR_WIDTH[i] * AVATAR_SCALE, AVATAR_HEIGHT[i] * AVATAR_SCALE)
      ctx.drawImage(petHand, WIDTH - (WIDTH * (i + 1)), 0, petHand.width, HEIGHT)
      encoder.addFrame(ctx)
    }

    encoder.finish()

    return encoder.out.getData()
  }

  static async weather ({ t }, title, { now, daily }, unit) {
    const WIDTH = 400
    const HEIGHT = 286

    const CARD_HEIGHT = 270
    const CARD_Y_MARGIN = HEIGHT - CARD_HEIGHT

    const INNER_MARGIN = 14

    const FONTS = (() => {
      const MEME = Math.random() > 0.99 && '"Comic Sans MS"'
      const EXTRABOLD = MEME || '"Montserrat ExtraBold"'
      const REGULAR = MEME || '"Montserrat"'
      const LIGHT = MEME || '"Montserrat Light"'
      const BLACK = MEME || '"Montserrat Black"'
      return {
        TITLE: `17px ${EXTRABOLD}`,
        TEMPERATURE: `bold 90px ${EXTRABOLD}`,
        INFORMATIONS: `17px ${LIGHT}`,
        WEEK_DAYS: `17px ${REGULAR}`,
        WEEK_TEMPERATURES: `29px ${LIGHT}`,
        UNIT: `34px ${BLACK}`
      }
    })()

    // General
    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.DEFAULT_BACKGROUND_GRAY_PNG, true),
      Image.from(Constants.ARROW_SVG, true),
      Image.from(Constants.WIND_SVG, true)
    ])

    const icon = (i) => i.toUpperCase().replace(/-/g, '_')
    const iconIndex = (i) => usedIcons.indexOf(icon(i))
    const usedIcons = daily.map(d => icon(d.icon)).reduce((a, i) => {
      if (!a.includes(i)) a.push(i)
      return a
    }, [icon(now.icon)])

    const ICONS_ASSETS = Promise.all(usedIcons.map(i => Image.from(Constants[`WEATHER_${i}`])))

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Card
    const BRIGHTER_HEIGHT = 150
    ctx.fillStyle = 'rgba(255, 255, 255, 0.051)'
    ctx.fillRect(0, CARD_Y_MARGIN, WIDTH, BRIGHTER_HEIGHT)

    // Currently
    const BRIGHTER_Y_CENTER = CARD_Y_MARGIN + BRIGHTER_HEIGHT * 0.5
    //   Temperature
    ctx.fillStyle = '#FFFFFF'
    const temperature = ctx.write(now.temperature, INNER_MARGIN, BRIGHTER_Y_CENTER, FONTS.TEMPERATURE, ALIGN.CENTER_LEFT)
    //   Temperature unit
    const UNIT_MARGIN = 4
    ctx.write(unit, temperature.rightX + UNIT_MARGIN, temperature.topY, FONTS.UNIT, ALIGN.TOP_LEFT)
    //   Extra info
    const INFO_Y = CARD_Y_MARGIN + BRIGHTER_HEIGHT - INNER_MARGIN
    const INFO_ICON_SIZE = 16

    const currentlyMax = ctx.write(now.max + unit, INNER_MARGIN + INFO_ICON_SIZE, INFO_Y, FONTS.INFORMATIONS, ALIGN.BOTTOM_LEFT)
    const currentlyMin = ctx.write(now.min + unit, currentlyMax.rightX + INNER_MARGIN + INFO_ICON_SIZE, INFO_Y, FONTS.INFORMATIONS, ALIGN.BOTTOM_LEFT)
    const currentlyWind = ctx.write(now.wind, currentlyMin.rightX + INNER_MARGIN + INFO_ICON_SIZE, INFO_Y, FONTS.INFORMATIONS, ALIGN.BOTTOM_LEFT)

    // Daily
    const temperatures = daily.map(d => d.temperature)
    const highTemp = Math.max(...temperatures)
    const lowTemp = Math.min(...temperatures)
    const tempDiff = highTemp - lowTemp

    const DAY_ICON_SIZE = 40
    const DAY_MARGIN = 22
    const DAY_WIDTH = ((WIDTH - (INNER_MARGIN * 2) - (DAY_MARGIN * (daily.length - 1))) / daily.length)
    daily.forEach((day, i) => {
      const DAY_X = INNER_MARGIN + (i * DAY_WIDTH + i * DAY_MARGIN) // (i * INNER_MARGIN * 2 + i * DAY_ICON_SIZE)
      const DAY_TEXT_X = DAY_X + DAY_ICON_SIZE * 0.5

      const WEEKDAY_Y = CARD_Y_MARGIN + BRIGHTER_HEIGHT + INNER_MARGIN
      const TEMPERATURE_Y = HEIGHT - INNER_MARGIN
      ctx.write(day.weekday, DAY_TEXT_X, WEEKDAY_Y, FONTS.WEEK_DAYS, ALIGN.TOP_CENTER)
      ctx.write(`${day.temperature}${unit}`, DAY_TEXT_X, TEMPERATURE_Y, FONTS.WEEK_DAYS, ALIGN.BOTTOM_CENTER)

      day.iconX = DAY_X
      day.iconY = (HEIGHT - ((CARD_HEIGHT - BRIGHTER_HEIGHT) * 0.5)) - DAY_ICON_SIZE * 0.5

      day.graphX = DAY_TEXT_X
      day.graphPoint = day.iconY - 5 + (((highTemp - day.temperature) / tempDiff) * (TEMPERATURE_Y + 10 - day.iconY))
    })

    // Assets
    const ICONS = await ICONS_ASSETS
    const getIcon = (i) => ICONS[iconIndex(i)]

    // Main Icon
    const MAIN_ICON_SIZE = 100
    ctx.drawIcon(getIcon(now.icon), WIDTH - INNER_MARGIN - MAIN_ICON_SIZE, BRIGHTER_Y_CENTER - MAIN_ICON_SIZE * 0.5, MAIN_ICON_SIZE, MAIN_ICON_SIZE, '#fff')

    // Daily Icons
    daily.forEach(day => {
      ctx.drawIcon(getIcon(day.icon), day.iconX, day.iconY, DAY_ICON_SIZE, DAY_ICON_SIZE, '#fff')
    })

    const [backgroundImage, arrowImage, windImage] = await IMAGE_ASSETS

    // Max
    ctx.drawIcon(arrowImage, INNER_MARGIN, currentlyMax.topY, INFO_ICON_SIZE, INFO_ICON_SIZE, '#fff')
    // Min
    ctx.drawIcon(arrowImage, currentlyMin.leftX - INFO_ICON_SIZE, currentlyMin.topY, INFO_ICON_SIZE, INFO_ICON_SIZE, '#fff', 180)
    // Wind
    ctx.drawIcon(windImage, currentlyWind.leftX - INFO_ICON_SIZE - 5, currentlyWind.topY, INFO_ICON_SIZE, INFO_ICON_SIZE, '#fff')

    ctx.save()
    // Background operations
    ctx.globalCompositeOperation = 'destination-over'

    // Graph
    const graphGradient = ctx.createLinearGradient(0, 0, WIDTH, 0)
    graphGradient.addColorStop(0, 'rgba(0, 0, 0, 0.15)')
    graphGradient.addColorStop(1, 'rgba(0, 0, 0, 0.35)')
    ctx.fillStyle = graphGradient

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    daily.forEach(({ graphPoint, graphX }, i) => {
      if (i === 0) ctx.moveTo(0, graphPoint)
      ctx.lineTo(graphX, graphPoint)
      if (i === daily.length - 1) ctx.lineTo(WIDTH, graphPoint)
    })
    ctx.stroke()
    ctx.lineTo(WIDTH, HEIGHT)
    ctx.lineTo(0, HEIGHT)
    ctx.fill()

    // Background image
    ctx.drawImage(backgroundImage, 0, CARD_Y_MARGIN, WIDTH * 1.4, HEIGHT * 1.7)

    // Modal
    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(0, CARD_Y_MARGIN, WIDTH, CARD_HEIGHT, 10, true)

    ctx.restore()
    // Card title
    const TITLE_X = WIDTH * 0.5

    //   Title modal
    ctx.fillStyle = '#ffffff'
    const TITLE_RECT_X_MARGIN = 45
    const TITLE_RECT_WIDTH = measureText(ctx, FONTS.TITLE, title).width + TITLE_RECT_X_MARGIN
    const TITLE_RECT_HEIGHT = 32
    const TITLE_RECT_X = TITLE_X - TITLE_RECT_WIDTH * 0.5
    ctx.roundRect(TITLE_RECT_X, 0, TITLE_RECT_WIDTH, TITLE_RECT_HEIGHT, 15, true)
    //   Title text
    ctx.fillStyle = '#000000'
    ctx.write(title, TITLE_X, CARD_Y_MARGIN, FONTS.TITLE, ALIGN.CENTER)

    return canvas.toBuffer()
  }

  static async presidentialAlert (text) {
    const WIDTH = 1242
    const HEIGHT = 1050
    const background = await Image.from(Constants.PRESIDENTIAL_ALERT_TEMPLATE)
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const PARAGRAPH_START_X = 60
    const PARAGRAPH_START_Y = 830
    const PARAGRAPH_HEIGHT = 80
    const PARAGRAPH_WIDTH = 1120

    ctx.drawImage(background, 0, 0, WIDTH, HEIGHT)
    ctx.writeParagraph(text, '38px "SF Pro Display"', PARAGRAPH_START_X, PARAGRAPH_START_Y, PARAGRAPH_START_X + PARAGRAPH_WIDTH, PARAGRAPH_START_Y + PARAGRAPH_HEIGHT, 10, ALIGN.TOP_LEFT)
    return canvas.toBuffer()
  }

  static async plateMercosul (text, buffer) {
    const WIDTH = 1920
    const HEIGHT = 672
    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.PLACA_MERCOSUL_PNG, true),
      Image.from(buffer)
    ])
    const [background, state] = await IMAGE_ASSETS
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#363536'

    const PARAGRAPH_START_X = 960
    const PARAGRAPH_START_Y = 373
    const PARAGRAPH_HEIGHT = 10
    const PARAGRAPH_WIDTH = 1920

    ctx.drawImage(background, 0, 0, WIDTH, HEIGHT)
    ctx.drawImage(state, 1720, 241, 114, 76)
    ctx.writeParagraph(text, '302px "FE-Font"', PARAGRAPH_START_X, PARAGRAPH_START_Y, PARAGRAPH_START_X + PARAGRAPH_WIDTH, PARAGRAPH_START_Y + PARAGRAPH_HEIGHT, 100, ALIGN.CENTER)
    return canvas.toBuffer()
  }

  static async oldPlate (plate, city) {
    const WIDTH = 1920
    const HEIGHT = 624
    const background = await Image.from(Constants.OLD_PLATE_PNG)
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const PARAGRAPH_START_X = 960
    const PARAGRAPH_START_Y = 372
    const PARAGRAPH_HEIGHT = 10
    const PARAGRAPH_WIDTH = 1920

    ctx.drawImage(background, 0, 0, WIDTH, HEIGHT)
    ctx.writeParagraph(city, '80px "Mandatory"', PARAGRAPH_START_X, 160, PARAGRAPH_START_X + PARAGRAPH_WIDTH, PARAGRAPH_START_Y + PARAGRAPH_HEIGHT, 10, ALIGN.CENTER)
    ctx.writeParagraph(plate, '320px "Mandatory"', PARAGRAPH_START_X, PARAGRAPH_START_Y, PARAGRAPH_START_X + PARAGRAPH_WIDTH, PARAGRAPH_START_Y + PARAGRAPH_HEIGHT, 10, ALIGN.CENTER)
    return canvas.toBuffer()
  }

  static async quieres (buffer) {
    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.QUIERES_HAND_PNG, true),
      Image.from(buffer)
    ])
    const [hand, image] = await IMAGE_ASSETS
    const WIDTH = image.width
    const HEIGHT = image.height
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT)
    ctx.drawImage(hand, WIDTH - hand.width, HEIGHT - hand.height, hand.width, hand.height)
    return canvas.toBuffer()
  }

  static async herewegoagain (buffer) {
    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.HERE_WE_GO_AGAIN_PNG, true),
      Image.from(buffer)
    ])
    const [template, image] = await IMAGE_ASSETS
    const WIDTH = image.width
    const HEIGHT = image.height
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT)
    ctx.drawImage(template, WIDTH - template.width, HEIGHT - template.height, template.width, template.height)
    return canvas.toBuffer()
  }

  static gradient (colors, width, height) {
    // TODO: more gradient directions besides linear
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    const grd = ctx.createLinearGradient(0, 0, width, 0)

    colors.forEach((color, i) => {
      grd.addColorStop((i / (colors.length - 1)), color)
    })

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)

    return canvas.toBuffer()
  }

  static async ship (users, shipName, percent) {
    users = await Promise.all(users)

    const WIDTH = 420
    const HEIGHT = 240

    const avatarPictures = users.map(u => Image.from(u.profile))
    const IMAGE_ASSETS = Promise.all([
      Image.from(Constants.HEART_SVG),
      ...avatarPictures
    ])

    const FONTS = (() => {
      const MEME = Math.random() > 0.99 && '"Comic Sans MS"'
      const EXTRABOLD = MEME || '"Montserrat ExtraBold"'
      const BLACK = MEME || '"Montserrat Black"'
      return {
        TITLE: `italic 27px ${EXTRABOLD}`,
        PERCENT: `italic 27px ${BLACK}`
      }
    })()

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Avatar background
    const AVATAR_BACKGROUND_RADIUS = 68
    const AVATAR_SIZE = AVATAR_BACKGROUND_RADIUS * 1.84
    const AVATAR_INNER_MARGIN = 122
    const AVATAR_BACKGROUND_Y = HEIGHT * 0.57
    const getAvatarXCord = i => WIDTH * 0.5 + (i === 1 ? AVATAR_INNER_MARGIN : -Math.abs(AVATAR_INNER_MARGIN))

    users.forEach((user, i) => {
      ctx.fillStyle = user.document.favColor
      ctx.circle(getAvatarXCord(i), AVATAR_BACKGROUND_Y, AVATAR_BACKGROUND_RADIUS, 0, Math.PI * 2)
    })

    //  IMAGES
    const [heartIcon, ...avatarImages] = await IMAGE_ASSETS

    // Avatars
    users.forEach((user, i) => {
      const AVATAR_X = getAvatarXCord(i) - AVATAR_SIZE * 0.5
      const AVATAR_Y = AVATAR_BACKGROUND_Y - AVATAR_SIZE * 0.5

      ctx.roundImage(avatarImages[i], AVATAR_X, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE)
    })

    // Heart
    const HEART_W = 88
    const HEART_H = 81
    const HEART_X = WIDTH * 0.5
    const HEART_Y = AVATAR_BACKGROUND_Y
    const HEART_COLOR = '#be1931'

    ctx.drawIcon(heartIcon, HEART_X - HEART_W * 0.5, HEART_Y - HEART_H * 0.5, HEART_W, HEART_H, HEART_COLOR)

    // Grey heart
    const HEART_GREY_COLOR = '#5c616b'
    ctx.globalCompositeOperation = 'source-atop'

    const GREY_HEIGHT = (1 - (percent / 100)) * HEART_H
    ctx.fillStyle = HEART_GREY_COLOR
    ctx.fillRect(HEART_X - HEART_W * 0.5, HEART_Y - HEART_H * 0.5, 100, GREY_HEIGHT)

    ctx.globalCompositeOperation = 'source-over'
    // Percent
    ctx.fillStyle = '#fff'
    ctx.write(`${percent}%`, HEART_X, HEART_Y * 0.96, FONTS.PERCENT, ALIGN.CENTER)

    // Card Title
    const TITLE_X = WIDTH * 0.5

    //  Title modal
    ctx.fillStyle = '#fff'
    const TITLE_RECT_X_MARGIN = 45
    const TITLE_RECT_WIDTH = measureText(ctx, FONTS.TITLE, shipName).width + TITLE_RECT_X_MARGIN
    const TITLE_RECT_HEIGHT = 37
    const TITLE_RECT_Y = 28
    const TITLE_RECT_X = TITLE_X - TITLE_RECT_WIDTH * 0.5
    const TITLE_TEXT_MARGIN = TITLE_RECT_HEIGHT * 0.5
    ctx.roundRect(TITLE_RECT_X, TITLE_RECT_Y, TITLE_RECT_WIDTH, TITLE_RECT_HEIGHT, 20, true)
    //   Title text
    ctx.fillStyle = '#000000'
    ctx.write(shipName, TITLE_X, TITLE_RECT_Y + TITLE_TEXT_MARGIN, FONTS.TITLE, ALIGN.CENTER)

    return canvas.toBuffer()
  }

  static async moreJpeg (buffer) {
    const myimg = await Image.from(buffer)
    const WIDTH = myimg.width
    const HEIGHT = myimg.height
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(myimg, 0, 0, WIDTH, HEIGHT)
    return canvas.toBuffer('image/jpeg', { quality: 0.08 })
  }

  static async kannaPaper (text) {
    const background = await Image.from(Constants.KANNA_PAPER_TEMPLATE)
    const canvas = createCanvas(background.width, background.height)
    const ctx = canvas.getContext('2d')

    const cutWord = (word, count) => {
      return word.match(new RegExp(`.{0,${count}}`, 'g')).filter(w => w)
    }

    const lineBreak = (text, perLine = 10, maxLines = 6) => {
      const lines = ['']
      let currentLineIndex = 0
      let lastSpaceIndex = 0

      const getPreviusLine = phrase => {
        if (lines[currentLineIndex]) {
          return lines[currentLineIndex] + ' ' + phrase
        }
        return lines[currentLineIndex] + phrase
      }

      for (let i = 0; i <= text.length; i++) {
        if (text[i] === ' ' || i === text.length || text[i] === '\n') {
          const phrase = text.slice(lastSpaceIndex, i).trim()

          const previusLine = getPreviusLine(phrase)

          if (phrase.length > perLine) {
            if (lines.length === 1) {
              lines.splice(0, 1)
            }

            const words = cutWord(phrase, perLine)
            const maxWords = words.length - ((lines.length + words.length) - maxLines)
            const parsedWords = words.slice(0, maxWords)

            lines.push(...parsedWords)

            currentLineIndex += parsedWords.length
            if (lines.length >= maxLines) {
              break
            }
          } else if (previusLine.length > perLine) {
            if (lines.length >= maxLines) {
              break
            }
            lines.push(phrase)
            currentLineIndex++
          } else {
            if (!lines[currentLineIndex]) {
              lines[currentLineIndex] += phrase
            } else {
              lines[currentLineIndex] += ' ' + phrase
            }
          }
          lastSpaceIndex = i
        }
      }

      return lines
    }

    ctx.drawImage(background, 0, 0, background.width, background.height)
    ctx.font = '15px "Arial"'
    ctx.rotate(12 * Math.PI / 180)

    const lines = lineBreak(text, 13, 6)
    ctx.fillText(lines.join('\n'), 53, 25)

    return canvas.toBuffer()
  }

  static async instagramFeed (urls, GAP = 3) {
    const SIZE = 500
    const TILES = 3

    const canvas = createCanvas(SIZE, SIZE)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, SIZE, SIZE)

    const images = await Promise.all(urls.map(i => loadImage(i)))

    const GAPS_SIZE = GAP * (TILES - 1)
    const TILE_SIZE = ((SIZE - GAPS_SIZE) / TILES)

    let count = 0
    for (let i = 0; i < TILES; i++) {
      for (let j = 0; j < TILES; j++) {
        const img = images[count]
        if (!img) break

        ctx.drawImage(img, j * (TILE_SIZE + GAP), i * (TILE_SIZE + GAP), TILE_SIZE, TILE_SIZE)

        count++
      }
    }

    return canvas.toBuffer()
  }
}
