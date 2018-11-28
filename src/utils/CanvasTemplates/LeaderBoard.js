const Constants = require('../Constants');
const { ALIGN, measureText } = require('../CanvasUtils.js');

const { createCanvas, Image, Canvas: { createSVGCanvas } } = require('canvas');

class LeaderBoard {
  static async render ({ t }, top, { icon, iconWidth, iconHeight, title, valueFunction }) {
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
}

module.exports = LeaderBoard;