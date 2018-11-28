const Constants = require('../Constants');
const { ALIGN, measureText } = require('../CanvasUtils.js');
const Color = require('../Color.js');

const { createCanvas, Image, Canvas: { createSVGCanvas } } = require('canvas');

class Profile {
    static async render ({ t }, user, userDocument, role) {
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
}

module.exports = Profile;