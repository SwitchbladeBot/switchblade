const request = require('request')
const { promises: fs } = require('fs')
const { createCanvas, registerFont, Context2d, Image } = require('canvas')

const URLtoBuffer = function (url) {
  return new Promise((resolve, reject) => {
    request.get({url, encoding: null, isBuffer: true}, (err, res, body) => {
      if (!err && res && res.statusCode === 200 && body) resolve(body)
      else reject(err || res)
    })
  })
}

module.exports = class CanvasUtils {
  static initializeHelpers () {
    // Initiliaze fonts
    registerFont('src/assets/fonts/Montserrat-Regular.ttf', {family: 'Montserrat'})
    registerFont('src/assets/fonts/Montserrat-Bold.ttf', {family: 'Montserrat', weight: 'bold'})
    registerFont('src/assets/fonts/Montserrat-BoldItalic.ttf', {family: 'Montserrat', style: 'italic', weight: 'bold'})
    registerFont('src/assets/fonts/Montserrat-SemiBold.ttf', {family: 'Montserrat SemiBold'})
    registerFont('src/assets/fonts/Montserrat-Black.ttf', {family: 'Montserrat Black'})

    // Image loading
    Image.from = function (url, localFile = false) {
      return new Promise(async (resolve, reject) => {
        const b = await (localFile ? fs.readFile(url) : URLtoBuffer(url)) 
        const img = new Image()
        img.onerror = (e) => reject(e)
        img.onload = () => resolve(img)
        img.src = b
      })
    }

    // Context functions
    Context2d.prototype.roundImage = function (img, x, y, w, h, r) {
      this.drawImage(this.roundImageCanvas(img, w, h, r), x, y, w, h)
      return this
    }

    Context2d.prototype.roundImageCanvas = function (img, w = img.width, h = img.height, r = w * 0.5) {
      const SCanvas = createCanvas(w, h)
      const SCtx = SCanvas.getContext('2d')

      SCtx.clearRect(0, 0, SCanvas.width, SCanvas.height)

      SCtx.globalCompositeOperation = 'source-over'
      SCtx.drawImage(img, 0, 0, w, h)

      SCtx.fillStyle = '#fff'
      SCtx.globalCompositeOperation = 'destination-in'
      SCtx.beginPath()
      SCtx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2, true)
      SCtx.closePath()
      SCtx.fill()

      return SCanvas
    }

    Context2d.prototype.circle = function(x, y, r, a1, a2) {
      this.beginPath()
      this.arc(x, y, r, a1, a2, true)
      this.closePath()
      this.fill()
      return this
    }
  }
}
