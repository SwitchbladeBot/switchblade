const round = (n, p = 3) => parseFloat(n.toFixed(p))

const parseRGBValue = n => Math.max(0, Math.min(255, parseInt(n)))
const parseRGBAlpha = n => Math.max(0, Math.min(1, round(parseFloat(n))))
const parseHexValue = n => parseRGBValue(parseInt(n, 16))
const parseHexAlpha = n => parseRGBAlpha(parseInt(n, 16) / 255)

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

  // Is a valid color?
  get valid () {
    return !!this._rgba
  }

  // RGB - RGBA
  get rgbArray () {
    return this._rgba.slice(0, 3)
  }

  get rgbaArray () {
    return this._rgba.slice(0, 4)
  }

  get rgb () {
    return this.valid ? `rgb(${this.rgbArray.join(', ')})` : null
  }

  get rgba () {
    return this.valid ? `rgba(${this.rgbaArray.join(', ')})` : null
  }

  // Hex
  hexArray (alpha = true) {
    if (!this.valid) return

    let array = this.rgbArray
    if (alpha) {
      array = this.rgbaArray
      array.push(Math.round(array.pop() * 255))
    }
    return array.map(c => c.toString(16).padStart(2, '0'))
  }

  hex (alpha = true, hash = true) {
    return this.valid ? `${hash ? '#' : ''}${this.hexArray(alpha).join('')}` : null
  }

  get colorLuminance () {
    if (!this.valid) return 0
    const [ r, g, b ] = this.rgbArray.map(v => v / 255).map(v => v < 0.03928 ? v / 12.92 : Math.pow(((v + 0.055) / 1.055), 2))
    return (r * 0.2126) + (g * 0.7152) + (b * 0.0722)
  }

  get colorInvert () {
    return this.colorLuminance > 0.55 ? new Color('#000000B2') : new Color('#FFFFFFFF')
  }

  // Static methods
  static parseColor (text) {
    if (typeof text === 'string') {
      const color = this.parseHex(text) || this.parseSimpleHex(text) || this.parseRGB(text) || this.parseRGBA(text)
      if (color) return color.map(v => isNaN(v) ? 0 : v)
    } else if (text instanceof Array) {
      let array = (text.length === 3 || text.length === 4) && text.every(t => !isNaN(t)) && text
      if (array) {
        const [ r, g, b ] = array
        const a = array[3] || 1
        return [ parseRGBValue(r), parseRGBValue(g), parseRGBValue(b), parseRGBAlpha(a) ]
      }
    }
  }

  static parseRGB (text) {
    if (this.RGB_REGEX.test(text)) {
      const [ , r, g, b ] = this.RGB_REGEX.exec(text)
      return [ parseRGBValue(r), parseRGBValue(g), parseRGBValue(b), 1 ]
    }
    return null
  }

  static parseRGBA (text) {
    if (this.RGBA_REGEX.test(text)) {
      const [ , r, g, b, a ] = this.RGBA_REGEX.exec(text)
      return [ parseRGBValue(r), parseRGBValue(g), parseRGBValue(b), parseRGBAlpha(a) ]
    }
    return null
  }

  static parseHex (text) {
    if (this.HEX_REGEX.test(text)) {
      const [ , hex, alpha ] = this.HEX_REGEX.exec(text)
      const rgba = hex.match(/[a-f\d]{2}/gi).map(parseHexValue) // Base hex
      rgba.push(parseHexAlpha(alpha || 'ff')) // Alpha
      return rgba
    }
    return null
  }

  static parseSimpleHex (text) {
    if (this.SIMPLE_HEX_REGEX.test(text)) {
      const [ , hex, alpha ] = this.SIMPLE_HEX_REGEX.exec(text)
      const rgba = hex.split('').map(v => parseHexValue(v + v)) // Base hex
      rgba.push(parseHexAlpha(alpha ? alpha + alpha : 'ff')) // Alpha
      return rgba
    }
    return null
  }
}

// Color regex
Color.RGB_REGEX = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i
Color.RGBA_REGEX = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(\.\d+)?)\)$/i
Color.HEX_REGEX = /^#?([a-f\d]{6})([a-f\d]{2})?$/i
Color.SIMPLE_HEX_REGEX = /^#?([a-f\d]{3})([a-f\d])?$/i

module.exports = Color
