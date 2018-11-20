const Constants = require('./Constants')
const { ALIGN, measureText } = require('./CanvasUtils.js')
const Color = require('./Color.js')

const { createCanvas, Image, Canvas: { createSVGCanvas } } = require('canvas')
const GIFEncoder = require('gifencoder')
const moment = require('moment')

module.exports = class CanvasTemplates {
  static async profile ({ t }, user, userDocument, role) {
    const WIDTH = 800
    const HEIGHT = 600

    const CARD_WIDTH = 644
    const CARD_HEIGHT = 600
    const CARD_X_MARGIN = (WIDTH - CARD_WIDTH) * 0.5
    const CARD_Y_MARGIN = (HEIGHT - CARD_HEIGHT) * 0.5

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
      Image.from(user.displayAvatarURL.replace('.gif', '.png')),
      Image.buffer(Constants.COINS_SVG, true),
      Image.buffer(Constants.REPUTATION_SVG, true),
      Image.from(Constants.DEFAULT_BACKGROUND_PNG, true)
    ])

    const FAVCOLOR = new Color(favColor)
    const TEXTCOLOR = '#FFF'

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Card drawing
    //   Darker rectangle
    const CARD_MARGIN = 192
    ctx.fillStyle = 'rgba(29, 29, 29, 0.94)'
    ctx.fillRect(CARD_X_MARGIN, CARD_Y_MARGIN + CARD_MARGIN, CARD_WIDTH, CARD_HEIGHT - CARD_MARGIN)
    //   Brighter rectangle
    const BRIGHTER_HEIGHT = 110
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)' // #FFFFFF1A
    ctx.fillRect(CARD_X_MARGIN, CARD_Y_MARGIN + CARD_MARGIN, CARD_WIDTH, BRIGHTER_HEIGHT)

    // Profile
    ctx.fillStyle = TEXTCOLOR
    const PROFILE_X = CARD_X_MARGIN + INNER_MARGIN * 2 + AVATAR_SIZE
    const PROFILE_Y = CARD_Y_MARGIN + CARD_MARGIN + BRIGHTER_HEIGHT * 0.5
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
      const TAG_Y = CARD_Y_MARGIN + CARD_MARGIN

      const TAG_COLOR = new Color(role.hexColor)
      ctx.fillStyle = TAG_COLOR.rgba(true)
      ctx.roundRect(PROFILE_X, TAG_Y - (TAG_HEIGHT * 0.5), TAG_NAME_WIDTH + TAG_MARGIN * 2, TAG_HEIGHT, TAG_HEIGHT * 0.5, true)
      ctx.fillStyle = TAG_COLOR.colorInvert.rgba(true)
      ctx.write(TAG_NAME, PROFILE_X + TAG_MARGIN, TAG_Y, FONTS.TAG_LABEL, ALIGN.CENTER_LEFT)
    }

    // XP
    //   XP Label
    const XP_LABEL_RADIUS = 18
    const XP_X = WIDTH - CARD_X_MARGIN - INNER_MARGIN - XP_LABEL_RADIUS
    const XP_Y = CARD_Y_MARGIN + CARD_MARGIN + BRIGHTER_HEIGHT
    ctx.fillStyle = '#151515'
    ctx.circle(XP_X, XP_Y, XP_LABEL_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = TEXTCOLOR
    ctx.write('XP', XP_X, XP_Y, FONTS.XP_LABEL, ALIGN.CENTER)
    //   XP Bar
    ctx.fillStyle = '#151515'
    const XP_BAR_HEIGHT = 13
    const XP_BAR_WIDTH = CARD_WIDTH - INNER_MARGIN * 2 - INNER_MARGIN * 0.5 - XP_LABEL_RADIUS * 2
    ctx.roundRect(CARD_X_MARGIN + INNER_MARGIN, XP_Y - XP_BAR_HEIGHT * 0.5, XP_BAR_WIDTH, XP_BAR_HEIGHT, XP_BAR_HEIGHT * 0.5, true)
    //   XP Bar current
    ctx.fillStyle = FAVCOLOR.rgba(true)
    ctx.roundRect(CARD_X_MARGIN + INNER_MARGIN, XP_Y - XP_BAR_HEIGHT * 0.5, XP_BAR_WIDTH * 0.5, XP_BAR_HEIGHT, XP_BAR_HEIGHT * 0.5, true)

    // Sections
    const SECTION_INNER_MARGIN = 16
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)' // #FFFFFF1A
    ctx.fillStyle = TEXTCOLOR
    //   Info sections
    const INFO_WIDTH = (CARD_WIDTH - INNER_MARGIN * 3) * 0.5
    const INFO_HEIGHT = 82
    const INFO_Y = HEIGHT - CARD_Y_MARGIN - INNER_MARGIN - INFO_HEIGHT

    //     Switchcoins
    const COINS_HEIGHT = INFO_HEIGHT - SECTION_INNER_MARGIN * 2 // 57
    const COINS_WIDTH = 57 / COINS_HEIGHT * 55 // 55
    const COINS_X = CARD_X_MARGIN + SECTION_INNER_MARGIN * 2
    const COINS_Y = INFO_Y + INFO_HEIGHT * 0.5 - COINS_HEIGHT * 0.5
    ctx.roundRect(CARD_X_MARGIN + INNER_MARGIN, INFO_Y, INFO_WIDTH, INFO_HEIGHT, 10, false, true)
    ctx.write('Switchcoins', COINS_X + COINS_WIDTH, INFO_Y + INFO_HEIGHT * 0.5 - 5, FONTS.INFO_LABEL, ALIGN.BOTTOM_LEFT)
    ctx.write(money, COINS_X + COINS_WIDTH, INFO_Y + INFO_HEIGHT * 0.5 + 5, FONTS.INFO_VALUE, ALIGN.TOP_LEFT)

    //     Reputation
    const REP_WIDTH = INFO_HEIGHT - SECTION_INNER_MARGIN * 2 // 46
    const REP_HEIGHT = 46 / REP_WIDTH * 65 // 65
    const REP_X = WIDTH - CARD_X_MARGIN - INNER_MARGIN - INFO_WIDTH
    const REP_Y = INFO_Y + INFO_HEIGHT * 0.5 - REP_HEIGHT * 0.5
    ctx.roundRect(REP_X, INFO_Y, INFO_WIDTH, INFO_HEIGHT, 10, false, true)
    ctx.write('Reputation', REP_X + REP_WIDTH + SECTION_INNER_MARGIN, INFO_Y + INFO_HEIGHT * 0.5 - 5, FONTS.INFO_LABEL, ALIGN.BOTTOM_LEFT)
    ctx.write(rep, REP_X + REP_WIDTH + SECTION_INNER_MARGIN, INFO_Y + INFO_HEIGHT * 0.5 + 5, FONTS.INFO_VALUE, ALIGN.TOP_LEFT)

    //   About section
    const ABOUT_WIDTH = CARD_WIDTH - INNER_MARGIN * 2
    const ABOUT_HEIGHT = 132
    const ABOUT_Y = INFO_Y - INNER_MARGIN - ABOUT_HEIGHT
    ctx.roundRect(CARD_X_MARGIN + INNER_MARGIN, ABOUT_Y, ABOUT_WIDTH, ABOUT_HEIGHT, 10, false, true)

    const about = ctx.write('About me', CARD_X_MARGIN + SECTION_INNER_MARGIN * 2, ABOUT_Y + SECTION_INNER_MARGIN, FONTS.ABOUT_LABEL, ALIGN.TOP_LEFT)
    ctx.writeParagraph(
      personalText,
      FONTS.ABOUT_VALUE,
      about.leftX,
      about.bottomY + INNER_MARGIN * 0.5,
      WIDTH - CARD_X_MARGIN - INNER_MARGIN * 2,
      ABOUT_Y + ABOUT_HEIGHT - INNER_MARGIN
    )

    // Image handling
    const [ avatarImage, coinsImage, repImage, backgroundImage ] = await IMAGE_ASSETS

    const AVATAR_HALF = AVATAR_SIZE * 0.5
    const AVATAR_Y = CARD_Y_MARGIN + CARD_MARGIN - (AVATAR_SIZE * 0.5)
    //   Avatar shadow
    ctx.save()
    ctx.fillStyle = '#00000099'
    ctx.shadowColor = '#00000099'
    ctx.shadowBlur = 10
    ctx.circle(CARD_X_MARGIN + INNER_MARGIN + AVATAR_HALF, AVATAR_Y + AVATAR_HALF, AVATAR_HALF, 0, Math.PI * 2)
    ctx.restore()
    //   Avatar
    ctx.roundImage(avatarImage, CARD_X_MARGIN + INNER_MARGIN, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE)

    //   Info section
    const coinsSVG = await createSVGCanvas(coinsImage.toString().replace(/\$COLOR/g, TEXTCOLOR), COINS_WIDTH, COINS_HEIGHT)
    ctx.drawImage(coinsSVG, COINS_X, COINS_Y, COINS_WIDTH, COINS_HEIGHT)
    const repSVG = await createSVGCanvas(repImage.toString().replace(/\$COLOR/g, TEXTCOLOR), REP_WIDTH, REP_HEIGHT)
    ctx.drawImage(repSVG, REP_X + SECTION_INNER_MARGIN, REP_Y, REP_WIDTH, REP_HEIGHT)

    //   Background image
    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(backgroundImage, CARD_X_MARGIN, CARD_Y_MARGIN, CARD_WIDTH, CARD_HEIGHT)

    // Modal
    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(CARD_X_MARGIN, CARD_Y_MARGIN, CARD_WIDTH, CARD_HEIGHT, 10, true)

    return canvas.toBuffer()
  }

  static async nowPlaying ({ t }, guildPlayer, song) {
    const WIDTH = 800
    const HEIGHT = 257

    const THUMBNAIL_WIDTH = 263
    let THUMBNAIL_HEIGHT = HEIGHT

    const IMAGE_ASSETS = Promise.all([
      Image.from(song.mainImage || Constants.DEFAULT_SONG_PNG, !song.mainImage),
      Image.from(song.backgroundImage || Constants.DEFAULT_SONG_PNG, !song.backgroundImage)
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
    const [ mainImage, backgroundImage ] = await IMAGE_ASSETS

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
    const WIDTH = 800
    const HEIGHT = 654

    const CARD_WIDTH = 680
    const CARD_HEIGHT = 590
    const CARD_X_MARGIN = (WIDTH - CARD_WIDTH) * 0.5
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

    const avatarCoords = []
    const avatarPictures = top.map(u => Image.from(u.user.displayAvatarURL.replace('.gif', '.png')))
    const IMAGE_ASSETS = Promise.all([
      Image.buffer(icon, true),
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
    ctx.fillRect(CARD_X_MARGIN, CARD_Y_MARGIN + CARD_MARGIN, CARD_WIDTH, CARD_HEIGHT - CARD_MARGIN)
    //   Brighter rectangle
    const BRIGHTER_HEIGHT = 110
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)' // #FFFFFF1A
    ctx.fillRect(CARD_X_MARGIN, CARD_Y_MARGIN + CARD_MARGIN, CARD_WIDTH, BRIGHTER_HEIGHT)

    // Top user
    ctx.fillStyle = TEXTCOLOR
    const TOP_USER_AVATAR_COORDS = [CARD_X_MARGIN + INNER_MARGIN + TOP_AVATAR_RADIUS, CARD_Y_MARGIN + CARD_MARGIN + INNER_MARGIN]
    const PROFILE_X = CARD_X_MARGIN + INNER_MARGIN * 2 + TOP_AVATAR_SIZE
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
    const SECTION_WIDTH = (CARD_WIDTH - INNER_MARGIN * 3) / 2
    const SECTION_HEIGHT = ((CARD_HEIGHT - CARD_MARGIN - BRIGHTER_HEIGHT) - INNER_MARGIN * 4) / 3
    top.forEach((u, i) => {
      i++
      const SECTION_X = CARD_X_MARGIN + INNER_MARGIN + (i % 2 ? 0 : SECTION_WIDTH + INNER_MARGIN)
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
    const [ valueImage, backgroundImage, ...avatarImages ] = await IMAGE_ASSETS

    const avatarImage = avatarImages.shift()
    //   Top avatar shadow
    const [ TOP_USER_AVATAR_X, TOP_USER_AVATAR_Y ] = TOP_USER_AVATAR_COORDS
    ctx.save()
    ctx.fillStyle = '#000000'
    ctx.shadowColor = '#000000'
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
    ctx.fillStyle = '#0000008f'
    ctx.write('1', MEDAL_X, MEDAL_Y, FONTS.TOP_POSITION, ALIGN.CENTER)

    // Others avatars
    avatarImages.forEach((avatar, i) => {
      const [ avatarX, avatarY ] = avatarCoords[i]
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
    ctx.drawImage(backgroundImage, CARD_X_MARGIN, CARD_Y_MARGIN, CARD_WIDTH, CARD_HEIGHT)

    //   Modal
    ctx.fillStyle = '#FFFFFF'
    ctx.globalCompositeOperation = 'destination-in'
    ctx.roundRect(CARD_X_MARGIN, CARD_Y_MARGIN, CARD_WIDTH, CARD_HEIGHT, 10, true)
    ctx.restore()

    //   Title
    ctx.fillStyle = '#FFFFFF'
    const TITLE_CIRCLE_RADIUS = 32
    const TITLE_X = CARD_X_MARGIN + TITLE_CIRCLE_RADIUS
    const TITLE_Y = CARD_Y_MARGIN
    ctx.circle(TITLE_X, TITLE_Y, TITLE_CIRCLE_RADIUS, 0, Math.PI * 2)

    const TITLE_NAME_WIDTH = measureText(ctx, FONTS.TITLE, title).width
    const TITLE_RECT_INNER_MARGIN = 30
    const TITLE_RECT_WIDTH = TITLE_NAME_WIDTH + TITLE_RECT_INNER_MARGIN * 2 + TITLE_RECT_INNER_MARGIN * 0.5
    const TITLE_RECT_HEIGHT = 42

    ctx.roundRect(TITLE_X, TITLE_Y - TITLE_RECT_HEIGHT * 0.5, TITLE_RECT_WIDTH, TITLE_RECT_HEIGHT, TITLE_RECT_HEIGHT * 0.5, true)

    const valueSVG = await createSVGCanvas(valueImage.toString().replace(/\$COLOR/g, '#000000'), iconWidth, iconHeight)
    ctx.drawImage(valueSVG, TITLE_X - iconWidth * 0.5, TITLE_Y - iconHeight * 0.5, iconWidth, iconHeight)

    ctx.fillStyle = '#000000'
    ctx.write(title, TITLE_X + TITLE_RECT_INNER_MARGIN * 1.5, TITLE_Y, FONTS.TITLE, ALIGN.CENTER_LEFT)

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
