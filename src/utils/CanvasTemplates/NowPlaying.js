const Constants = require('../Constants');
const { ALIGN } = require('../CanvasUtils.js');
const Color = require('../Color.js');

const { createCanvas, Image } = require('canvas');
const moment = require('moment');

class NowPlaying {
    static async render ({ t }, guildPlayer, song) {
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
}

module.exports = NowPlaying;