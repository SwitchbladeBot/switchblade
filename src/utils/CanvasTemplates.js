const Constants = require('./Constants')
const { ALIGN, measureText, hexToRGB } = require('./CanvasUtils.js')

const { createCanvas, Image } = require('canvas')
const moment = require('moment')

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day

module.exports = class CanvasTemplates {
  static async profile ({ t, client }, user) {
    const WIDTH = 800
    const HEIGHT = 600
    const BORDER = 25

    const USED_ASSETS = Promise.all([
      Image.from(user.displayAvatarURL.replace('.gif', '.png')),
      Image.from(Constants.COINS_PNG, true),
      Image.from(Constants.DAILY_CLOCK_PNG, true)
    ])
    const BACKGROUND_ASSET = await Image.from('https://i.imgur.com/mM3puy3.jpg')

    const { lastDaily, personalText, money } = await client.database.users.get(user.id)

    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Background
    ctx.drawImage(BACKGROUND_ASSET, 0, 0, WIDTH, HEIGHT)

    // Background gradient
    const gradientRGB = hexToRGB('#7289da')
    const gradientColor = (a) => `rgba(${gradientRGB.r}, ${gradientRGB.g}, ${gradientRGB.b}, ${a})`

    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grd.addColorStop(0, gradientColor(0))
    grd.addColorStop(0.35, gradientColor(0))
    grd.addColorStop(0.6, gradientColor(0.8))
    grd.addColorStop(1, gradientColor(0.9))
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Profile picture
    const PROFPIC_SIZE = 275
    const PROFPIC_HALF = PROFPIC_SIZE * 0.5

    ctx.shadowColor = 'black'
    ctx.shadowBlur = 10
    ctx.circle(BORDER + PROFPIC_HALF, 105 + PROFPIC_HALF, PROFPIC_HALF, 0, Math.PI * 2)
    ctx.shadowBlur = 0

    // Text
    ctx.fillStyle = 'white'

    // SWITCHBLADE text
    ctx.write('SWITCHBLADE', WIDTH - BORDER, BORDER, 'italic 29px "Montserrat Black"', ALIGN.TOP_RIGHT)

    // Balance info
    const LABEL_FONT = '29px "Montserrat"'
    const VALUE_FONT = '39px "Montserrat Black"'

    const TL = moment.duration(Math.max(DAILY_INTERVAL - (Date.now() - lastDaily), 0)).format('h[h] m[m] s[s]')
    const balanceX = WIDTH - Math.max(
      measureText(ctx, VALUE_FONT, TL).width,
      measureText(ctx, LABEL_FONT, 'Next reward in').width
    ) - BORDER

    const timeLeft = ctx.write(TL, balanceX, HEIGHT - BORDER, VALUE_FONT)
    const timeLeftLabel = ctx.write('Next reward in', balanceX, timeLeft.topY - 10, LABEL_FONT)

    const coins = ctx.write(money, balanceX, timeLeftLabel.topY - 40, VALUE_FONT)
    ctx.write('Switchcoins', balanceX, coins.topY - 10, LABEL_FONT)

    const iconSize = timeLeft.height + timeLeftLabel.height + 10
    const iconX = balanceX - 70

    // User info
    const usernameY = ctx.write(user.username, BORDER, 105 + PROFPIC_SIZE + 25, '44px "Montserrat Black"', ALIGN.TOP_LEFT).bottomY
    const discriminatorY = ctx.write(`#${user.discriminator}`, BORDER, usernameY + 10, '20px "Montserrat SemiBold"', ALIGN.TOP_LEFT).bottomY

    // Description
    let descriptionY = discriminatorY + 10
    const maxX = iconX - 15

    /* DEBUG
    ctx.strokeStyle = '#42f4f1'
    ctx.beginPath()
    ctx.moveTo(BORDER, descriptionY)
    ctx.lineTo(maxX, descriptionY)
    ctx.lineTo(maxX, HEIGHT - BORDER)
    ctx.lineTo(BORDER, HEIGHT - BORDER)
    ctx.lineTo(BORDER, descriptionY)
    ctx.stroke()
    */

    const lines = personalText.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i]
      if (!l) continue

      const font = '18px "Montserrat"'
      const lineText = measureText(ctx, font, l)
      const height = lineText.height
      if (descriptionY > HEIGHT - BORDER) break

      if (BORDER + lineText.width <= maxX) {
        ctx.write(l, BORDER, descriptionY, font, ALIGN.TOP_LEFT)
      } else {
        if (l.includes(' ')) {
          const words = l.split(' ')
          const maxIndex = words.findIndex((w, j) => {
            const word = words.slice(0, j + 1).join(' ')
            const wordText = measureText(ctx, font, word)
            if (BORDER + wordText.width <= maxX) return false
            else return true
          })
          const missingWords = words.slice(maxIndex, words.length)
          if (missingWords.length > 0) lines.splice(i + 1, 0, missingWords.join(' '))
          ctx.write(words.slice(0, maxIndex).join(' '), BORDER, descriptionY, font, ALIGN.TOP_LEFT)
        } else {
          const letters = l.split('')
          const maxIndex = letters.findIndex((w, j) => {
            const word = letters.slice(0, j + 1).join('')
            const wordText = measureText(ctx, font, word)
            if (BORDER + wordText.width <= maxX) return false
            else return true
          })
          ctx.write(letters.slice(0, maxIndex).join(''), BORDER, descriptionY, font, ALIGN.TOP_LEFT)
        }
      }
      descriptionY += height + 5
    }

    // Image handling
    const [ avatarImage, coinsImage, clockImage ] = await USED_ASSETS
    ctx.roundImage(avatarImage, BORDER, 105, PROFPIC_SIZE, PROFPIC_SIZE)

    ctx.drawImage(coinsImage, iconX, coins.bottomY - iconSize, iconSize, iconSize)
    ctx.drawImage(clockImage, iconX, timeLeft.bottomY - iconSize, iconSize, iconSize)

    return canvas.toBuffer()
  }
}
