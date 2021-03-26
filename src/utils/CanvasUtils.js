const request = require('request')
const { createCanvas, registerFont, loadImage, Context2d, Image } = require('canvas')

const FileUtils = require('./FileUtils.js')

const URLtoBuffer = function (url) {
  return new Promise((resolve, reject) => {
    request.get({ url, encoding: null, isBuffer: true }, (err, res, body) => {
      if (!err && res && res.statusCode === 200 && body) resolve(body)
      else reject(err || res)
    })
  })
}

const ALIGN = {
  TOP_LEFT: 1,
  TOP_CENTER: 2,
  TOP_RIGHT: 3,
  CENTER_RIGHT: 4,
  BOTTOM_RIGHT: 5,
  BOTTOM_CENTER: 6,
  BOTTOM_LEFT: 7,
  CENTER_LEFT: 8,
  CENTER: 9
}

module.exports = class CanvasUtils {
  static initializeHelpers () {
    const self = this

    // Initiliaze fonts
    registerFont('src/assets/fonts/Comic-Sans-MS.ttf', { family: 'Comic Sans MS' })
    registerFont('src/assets/fonts/Montserrat-Thin.ttf', { family: 'Montserrat Thin' })
    registerFont('src/assets/fonts/Montserrat-ThinItalic.ttf', { family: 'Montserrat Thin', style: 'italic' })
    registerFont('src/assets/fonts/Montserrat-Light.ttf', { family: 'Montserrat Light' })
    registerFont('src/assets/fonts/Montserrat-LightItalic.ttf', { family: 'Montserrat Light', style: 'italic' })
    registerFont('src/assets/fonts/Montserrat-Regular.ttf', { family: 'Montserrat' })
    registerFont('src/assets/fonts/Montserrat-Italic.ttf', { family: 'Montserrat', style: 'italic' })
    registerFont('src/assets/fonts/Montserrat-Medium.ttf', { family: 'Montserrat Medium' })
    registerFont('src/assets/fonts/Montserrat-MediumItalic.ttf', { family: 'Montserrat Medium', style: 'italic' })
    registerFont('src/assets/fonts/Montserrat-SemiBold.ttf', { family: 'Montserrat SemiBold' })
    registerFont('src/assets/fonts/Montserrat-SemiBoldItalic.ttf', { family: 'Montserrat SemiBold', style: 'italic' })
    registerFont('src/assets/fonts/Montserrat-Bold.ttf', { family: 'Montserrat', weight: 'bold' })
    registerFont('src/assets/fonts/Montserrat-BoldItalic.ttf', { family: 'Montserrat', style: 'italic', weight: 'bold' })
    registerFont('src/assets/fonts/Montserrat-ExtraBold.ttf', { family: 'Montserrat ExtraBold' })
    registerFont('src/assets/fonts/Montserrat-ExtraBoldItalic.ttf', { family: 'Montserrat ExtraBold', style: 'italic' })
    registerFont('src/assets/fonts/Montserrat-Black.ttf', { family: 'Montserrat Black' })
    registerFont('src/assets/fonts/Montserrat-BlackItalic.ttf', { family: 'Montserrat Black', style: 'italic' })
    registerFont('src/assets/fonts/SFProDisplay-Regular.ttf', { family: 'SF Pro Display' })
    registerFont('src/assets/fonts/Fe-Font.ttf', { family: 'Fe-Font' })
    registerFont('src/assets/fonts/Mandatory.ttf', { family: 'Mandatory' })

    // Image loading
    Image.from = function (url, localFile = false) {
      return loadImage(url)
    }

    Image.buffer = (url, localFile = false) => localFile ? FileUtils.readFile(url) : URLtoBuffer(url)

    // Context functions
    Context2d.prototype.roundImage = function (img, x, y, w, h, r) {
      this.drawImage(this.roundImageCanvas(img, w, h, r), x, y, w, h)
      return this
    }

    Context2d.prototype.roundImageCanvas = function (img, w = img.width, h = img.height, r = w * 0.5) {
      const canvas = createCanvas(w, h)
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(img, 0, 0, w, h)

      ctx.fillStyle = '#fff'
      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()

      return canvas
    }

    Context2d.prototype.circle = function (x, y, r, a1, a2, fill = true, stroke = false) {
      this.beginPath()
      this.arc(x, y, r, a1, a2, true)
      this.closePath()
      if (fill) this.fill()
      if (stroke) this.stroke()
      return this
    }

    Context2d.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
      let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 }
      if (typeof radius === 'object') {
        cornerRadius = Object.assign(cornerRadius, radius)
      } else if (typeof radius === 'number') {
        cornerRadius = { upperLeft: radius, upperRight: radius, lowerLeft: radius, lowerRight: radius }
      }

      this.beginPath()
      this.moveTo(x + cornerRadius.upperLeft, y)
      this.lineTo(x + width - cornerRadius.upperRight, y)
      this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight)
      this.lineTo(x + width, y + height - cornerRadius.lowerRight)
      this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height)
      this.lineTo(x + cornerRadius.lowerLeft, y + height)
      this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft)
      this.lineTo(x, y + cornerRadius.upperLeft)
      this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y)
      this.closePath()
      if (stroke) this.stroke()
      if (fill) this.fill()
      return this
    }

    Context2d.prototype.write = function (text, x, y, font = '12px "Montserrat"', align = ALIGN.BOTTOM_LEFT) {
      this.font = font
      const { width, height } = self.measureText(this, font, text)
      const { x: realX, y: realY } = self.resolveAlign(x, y, width, height, align)
      this.fillText(text, realX, realY)
      return {
        leftX: realX,
        rightX: realX + width,
        bottomY: realY,
        topY: realY - height,
        centerX: realX + width * 0.5,
        centerY: realY - height * 0.5,
        width,
        height
      }
    }

    Context2d.prototype.writeParagraph = function (text, font, startX, startY, maxX, maxY, lineDistance = 5, alignment = ALIGN.TOP_LEFT) {
      const lines = text.split('\n')
      let currentY = startY
      let lastWrite = null
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i]
        if (!l) continue

        const lineText = self.measureText(this, font, l)
        const height = lineText.height
        if (currentY > maxY) break

        if (startX + lineText.width <= maxX) {
          lastWrite = this.write(l, startX, currentY, font, alignment)
          alignment = ALIGN.TOP_LEFT
        } else {
          if (l.includes(' ')) {
            const words = l.split(' ')
            const maxIndex = words.findIndex((w, j) => {
              const word = words.slice(0, j + 1).join(' ')
              const wordText = self.measureText(this, font, word)
              if (startX + wordText.width <= maxX) return false
              else return true
            })
            const missingWords = words.slice(maxIndex, words.length)
            if (missingWords.length > 0) lines.splice(i + 1, 0, missingWords.join(' '))
            lastWrite = this.write(words.slice(0, maxIndex).join(' '), startX, currentY, font, alignment)
            alignment = ALIGN.TOP_LEFT
          } else {
            const letters = l.split('')
            const maxIndex = letters.findIndex((w, j) => {
              const word = letters.slice(0, j + 1).join('')
              const wordText = self.measureText(this, font, word)
              if (startX + wordText.width <= maxX) return false
              else return true
            })
            lastWrite = this.write(letters.slice(0, maxIndex).join(''), startX, currentY, font, alignment)
            alignment = ALIGN.TOP_LEFT
          }
        }
        currentY += height + lineDistance
      }
      return lastWrite
    }

    Context2d.prototype.blur = function (blur) {
      const delta = 5
      const alphaLeft = 1 / (2 * Math.PI * delta * delta)
      const step = blur < 3 ? 1 : 2
      let sum = 0
      for (let y = -blur; y <= blur; y += step) {
        for (let x = -blur; x <= blur; x += step) {
          const weight = alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta))
          sum += weight
        }
      }
      for (let y = -blur; y <= blur; y += step) {
        for (let x = -blur; x <= blur; x += step) {
          this.globalAlpha = alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta)) / sum * blur
          this.drawImage(this.canvas, x, y)
        }
      }
      this.globalAlpha = 1
    }

    Context2d.prototype.drawBlurredImage = function (image, blur, imageX, imageY, w = image.width, h = image.height) {
      const canvas = createCanvas(w, h)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, w, h)
      ctx.blur(blur)
      this.drawImage(canvas, imageX, imageY, w, h)
    }

    Context2d.prototype.drawIcon = function (image, x, y, w, h, color, rotate) {
      const canvas = createCanvas(image.width, image.height)
      const ctx = canvas.getContext('2d')

      ctx.save()

      if (rotate) {
        const centerX = canvas.width * 0.5
        const centerY = canvas.height * 0.5
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(rotate * Math.PI / 180)
        ctx.translate(-centerX, -centerY)
      }

      ctx.drawImage(image, 0, 0, image.width, image.height)
      ctx.restore()

      if (color) {
        ctx.globalCompositeOperation = 'source-in'
        ctx.fillStyle = color
        ctx.fillRect(0, 0, image.width, image.height)
      }
      this.drawImage(canvas, x, y, w, h)
      return canvas
    }
  }

  static measureText (ctx, font, text) {
    ctx.font = font
    const measure = ctx.measureText(text)
    return {
      width: measure.width,
      height: measure.actualBoundingBoxAscent
    }
  }

  // Transforms an x, y coordinate into an bottom-left aligned coordinate
  static resolveAlign (x, y, width, height, align) {
    const realCoords = { x, y }
    switch (align) {
      case ALIGN.TOP_LEFT:
        realCoords.y = y + height
        break
      case ALIGN.TOP_CENTER:
        realCoords.x = x - width * 0.5
        realCoords.y = y + height
        break
      case ALIGN.TOP_RIGHT:
        realCoords.x = x - width
        realCoords.y = y + height
        break
      case ALIGN.CENTER_RIGHT:
        realCoords.x = x - width
        realCoords.y = y + height * 0.5
        break
      case ALIGN.BOTTOM_RIGHT:
        realCoords.x = x - width
        break
      case ALIGN.BOTTOM_CENTER:
        realCoords.x = x - width * 0.5
        break
      case ALIGN.CENTER_LEFT:
        realCoords.y = y + height * 0.5
        break
      case ALIGN.CENTER:
        realCoords.x = x - width * 0.5
        realCoords.y = y + height * 0.5
        break
    }
    return realCoords
  }
}

module.exports.ALIGN = ALIGN
