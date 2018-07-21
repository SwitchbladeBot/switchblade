const parseRGBValue = n => Math.max(0, Math.min(255, parseInt(n)))
const parseRGBAlpha = n => Math.max(0, Math.min(1, parseFloat(parseFloat(n).toFixed(3))))
const parseHexValue = n => parseRGBValue(parseInt(n, 16))
const parseHexAlpha = n => parseRGBAlpha(parseInt(n, 16) / 255)

const toHex = n => n.toString(16).padStart(2, '0')

class Color {
  constructor (color) {
    this.setColor(color)
  }

  setColor (color = '#000000') {
    if (color) {
      this._rgba = this.constructor.parseColor(color)
      return this._rgba
    }
    this._rgba = null
  }

  setAlpha (alpha) {
    alpha = parseRGBAlpha(alpha) || parseHexAlpha(alpha)
    if (this.valid && !isNaN(alpha)) this._rgba[3] = alpha
    return this
  }

  // Is a valid color?
  get valid () {
    return !!this._rgba
  }

  rgbArray (hex = false) {
    if (!this.valid) return
    const rgb = this._rgba.slice(0, 3)
    return hex ? rgb.map(toHex) : rgb
  }

  rgbaArray (hex = false) {
    if (!this.valid) return
    const rgba = this._rgba.slice(0, 4)
    if (hex) rgba.push(Math.round(rgba.pop() * 255))
    return hex ? rgba.map(toHex) : rgba
  }

  rgb (hex = false) {
    return this.valid ? hex ? `#${this.rgbArray(true).join('')}` : `rgb(${this.rgbArray(false).join(', ')})` : null
  }

  rgba (hex = false) {
    return this.valid ? hex ? `#${this.rgbaArray(true).join('')}` : `rgba(${this.rgbaArray(false).join(', ')})` : null
  }

  get colorLuminance () {
    if (!this.valid) return 0
    const [ r, g, b ] = this.rgbArray(false).map(v => v / 255).map(v => v < 0.03928 ? v / 12.92 : Math.pow(((v + 0.055) / 1.055), 2))
    return (r * 0.2126) + (g * 0.7152) + (b * 0.0722)
  }

  get colorInvert () {
    return this.colorLuminance > 0.55 ? new Color('#000000B2') : new Color('#FFFFFFFF')
  }

  // Static methods
  static parseColor (text) {
    if (typeof text === 'string') {
      const color = this.parseHex(text) || this.parseSimpleHex(text) || this.parseRGB(text)
      if (color) return color.map(v => isNaN(v) ? 0 : v)
    }

    const array = text instanceof Array && (text.length === 3 || text.length === 4) && text.every(t => !isNaN(t)) && text
    if (array) {
      let [ r, g, b, a ] = array
      if (!a && a !== 0) a = 1
      return [ parseRGBValue(r), parseRGBValue(g), parseRGBValue(b), parseRGBAlpha(a) ]
    }
  }

  static parseRGB (text) {
    if (this.RGB_REGEX.test(text)) {
      let [ , r, g, b, a ] = this.RGB_REGEX.exec(text)
      a = a || 1
      return [ parseRGBValue(r), parseRGBValue(g), parseRGBValue(b), parseRGBAlpha(a) ]
    }
  }

  static parseHex (text) {
    if (this.HEX_REGEX.test(text)) {
      const [ , hex, alpha ] = this.HEX_REGEX.exec(text)
      const rgba = hex.match(/[a-f\d]{2}/gi).map(parseHexValue) // Base hex
      rgba.push(parseHexAlpha(alpha || 'ff')) // Alpha
      return rgba
    }
  }

  static parseSimpleHex (text) {
    if (this.SIMPLE_HEX_REGEX.test(text)) {
      const [ , hex, alpha ] = this.SIMPLE_HEX_REGEX.exec(text)
      const rgba = hex.split('').map(v => parseHexValue(v + v)) // Base hex
      rgba.push(parseHexAlpha(alpha ? alpha + alpha : 'ff')) // Alpha
      return rgba
    }
  }
}

// Color regex
Color.RGB_REGEX = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)$/i
Color.HEX_REGEX = /^#?([a-f\d]{6})([a-f\d]{2})?$/i
Color.SIMPLE_HEX_REGEX = /^#?([a-f\d]{3})([a-f\d])?$/i

module.exports = Color
