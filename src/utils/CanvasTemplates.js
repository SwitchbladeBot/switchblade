const Constants = require('./Constants')

const { createCanvas, Image } = require('canvas')
const moment = require('moment')

const DAILY_INTERVAL = 24 * 60 * 60 * 1000 // 1 day

const measureText = function(ctx, font, text) {
  ctx.font = font
  const measure = ctx.measureText(text)
  return {
    width: measure.width,
    height: measure.actualBoundingBoxAscent
  }
}

module.exports = class CanvasTemplates {
  static async profile ({ t, client }, user) {
    //const WIDTH = 1000
    const WIDTH = 800
    const HEIGHT = 600
    const BORDER = 25

    const { lastDaily, money } = await client.database.users.get(user.id)
    
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
    ctx.circle(BORDER + PROFPIC_HALF, 105 + PROFPIC_HALF, PROFPIC_HALF, 0, Math.PI * 2)
    ctx.shadowBlur = 0

    const avatarURL = user.displayAvatarURL.replace('.gif', '.png')
    const profPic = await Image.from(avatarURL)
    ctx.roundImage(profPic, BORDER, 105, PROFPIC_SIZE, PROFPIC_SIZE)


    // Text
    ctx.fillStyle = 'white'

    // SWITCHBLADE text
    const switchbladeText = measureText(ctx, 'italic 29px "Montserrat Black"', 'SWITCHBLADE')
    ctx.font = 'italic 29px "Montserrat Black"'
    ctx.fillText('SWITCHBLADE', WIDTH - BORDER - switchbladeText.width, BORDER + switchbladeText.height)


    // Left text

    // Username
    const usernameX = 105 + PROFPIC_SIZE + 62
    ctx.font = '44px "Montserrat Black"'
    ctx.fillText(user.username, BORDER, usernameX)

    // Discriminator
    ctx.font = '20px "Montserrat SemiBold"'
    ctx.fillText(`#${user.discriminator}`, BORDER, usernameX + 32)

    // Balance info
    const dailyText = measureText(ctx, '29px "Montserrat"', 'Next reward in')

    const TL = moment.duration(Math.max(DAILY_INTERVAL - (Date.now() - lastDaily), 0)).format('h[h] m[m] s[s]')
    const TLText = measureText(ctx, '39px "Montserrat Black"', TL)
    const TLX = Math.min(WIDTH - dailyText.width - BORDER, WIDTH - TLText.width - BORDER)
    const TLY = HEIGHT - BORDER

    const coinsText = measureText(ctx, '39px "Montserrat Black"', TL)
    const coinsY = TLY - TLText.height - dailyText.height - 50

    const iconSize = dailyText.height + TLText.height + 10
    const iconX = TLX - 70

    ctx.drawImage(await Image.from(Constants.COINS_PNG, true), iconX, coinsY - iconSize, iconSize, iconSize)
    ctx.font = '29px "Montserrat"'
    ctx.fillText('Switchcoins', TLX, coinsY - coinsText.height - 10)
    ctx.font = '39px "Montserrat Black"'
    ctx.fillText(money, TLX, coinsY)

    ctx.drawImage(await Image.from(Constants.DAILY_CLOCK_PNG, true), iconX, TLY - iconSize, iconSize, iconSize)
    ctx.font = '29px "Montserrat"'
    ctx.fillText('Next reward in', TLX, TLY - TLText.height - 10)
    ctx.font = '39px "Montserrat Black"'
    ctx.fillText(TL, TLX, TLY)

    // Description
    const description = [
      'Suspendisse ut enim vitae felis maximus pulvinar vitae vitae augue.', 'Integer posuere volutpat leo vitae aliquam.',
      'Donec vitae feugiat leo, at vehicula tellus. Maecenas eget rutrum risus, ut mollis massa.', 'Mauris ut sagittis elit.'
    ].join('\n')

    const maxX = iconX - 20
    let descriptionY = usernameX + 62
    description.split('\n').forEach(l => {
      const lineText = measureText(ctx, '18px "Montserrat"', l)
      const height = lineText.height
      ctx.font = '18px "Montserrat"'
      if (BORDER + lineText.width <= maxX) {
        ctx.fillText(l, BORDER, descriptionY)
      } else {
        let x = 0
        ctx.fillText(l.split(' ').reduce((lw, w, i, a) => {
          const word = lw ? `${lw} ${w}` : w
          const wordText = measureText(ctx, '18px "Montserrat"', word)
          if (BORDER + wordText.width <= maxX && !a.done) return word
          else a.done = true; return lw
        }, ''), BORDER, descriptionY)
      }
      descriptionY += height + 5
    })

    return canvas.toBuffer()
  }
}