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

  // RGB
  rgbArray (hex = false) {
    if (!this.valid) return
    const rgb = this._rgba.slice(0, 3)
    return hex ? rgb.map(toHex) : rgb
  }

  rgb (hex = false, clean = false) {
    return this.valid ? hex ? `${clean ? '' : '#'}${this.rgbArray(true).join('')}` : `rgb(${this.rgbArray(false).join(', ')})` : null
  }

  // RGBA
  rgbaArray (hex = false) {
    if (!this.valid) return
    const rgba = this._rgba.slice(0, 4)
    if (hex) rgba.push(Math.round(rgba.pop() * 255))
    return hex ? rgba.map(toHex) : rgba
  }

  rgba (hex = false) {
    return this.valid ? hex ? `#${this.rgbaArray(true).join('')}` : `rgba(${this.rgbaArray(false).join(', ')})` : null
  }

  // HSL
  static calcHue (R, G, B, M, C) {
    let H = 0
    if (C !== 0) {
      switch (M) {
        case R:
          H = ((G - B) / C) % 6
          break
        case G:
          H = ((B - R) / C) + 2
          break
        case B:
          H = ((R - G) / C) + 4
          break
      }
    }
    H *= 60
    return H < 0 ? H + 360 : H
  }

  static calcSaturation (L, C) {
    return L === 1 ? 0 : C / (1 - Math.abs(2 * L - 1))
  }

  static calcLightness (R, G, B, m, M, type = 'bi-hexcone') {
    return type === 'luma601'
      ? (0.299 * R) + (0.587 * G) + (0.114 * B)
      : type === 'luma709'
        ? (0.2126 * R) + (0.7152 * G) + (0.0772 * B)
        : type === 'bi-hexcone'
          ? ((m + M) * 0.5)
          : 0
  }

  hslArray () {
    const [R, G, B] = this.rgbArray().map(v => v / 255)
    const M = Math.max(R, G, B)
    const m = Math.min(R, G, B)
    const C = M - m
    const H = maxCap(this.constructor.calcHue(R, G, B, M, C), 0, 360)
    const L = maxCap(this.constructor.calcLightness(R, G, B, m, M))
    const S = maxCap(this.constructor.calcSaturation(L, C))
    return [toFixed(H, 1), toFixed(S), toFixed(L)]
  }

  hsl () {
    return this.valid ? `hsl(${this.hslArray().join(', ')})` : null
  }

  // Luminance
  get colorLuminance () {
    if (!this.valid) return 0
    const [R, G, B] = this.rgbArray(false).map(v => v / 255).map(v => v < 0.03928 ? v / 12.92 : Math.pow(((v + 0.055) / 1.055), 2))
    return this.constructor.calcLightness(R, G, B, null, null, 'luma709')
  }

  get colorInvert () {
    return this.colorLuminance > 0.55 ? new Color('#000000') : new Color('#FFFFFF')
  }

  // Static methods
  static parseColor (text) {
    if (typeof text === 'string') {
      const color = this.parseHex(text) || this.parseSimpleHex(text) || this.parseRGB(text) || this.parseHSL(text)
      if (color) return color.map(v => isNaN(v) ? 0 : v)
    }

    const array = text instanceof Array && (text.length === 3 || text.length === 4) && text.every(t => !isNaN(t)) && text
    if (array) {
      let [R, G, B, A] = array
      if (!A && A !== 0) A = 1
      return [parseRGBValue(R), parseRGBValue(G), parseRGBValue(B), parseRGBAlpha(A)]
    }
  }

  static parseRGB (text) {
    if (this.RGB_REGEX.test(text)) {
      let [, R, G, B, A] = this.RGB_REGEX.exec(text)
      A = A || 1
      return [parseRGBValue(R), parseRGBValue(G), parseRGBValue(B), parseRGBAlpha(A)]
    }
  }

  static parseHex (text) {
    if (this.HEX_REGEX.test(text)) {
      const [, HEX, A] = this.HEX_REGEX.exec(text)
      const rgba = HEX.match(/[a-f\d]{2}/gi).map(parseHexValue) // Base hex
      rgba.push(parseHexAlpha(A || 'ff')) // Alpha
      return rgba
    }
  }

  static parseSimpleHex (text) {
    if (this.SIMPLE_HEX_REGEX.test(text)) {
      const [, HEX, A] = this.SIMPLE_HEX_REGEX.exec(text)
      const rgba = HEX.split('').map(v => parseHexValue(v + v)) // Base hex
      rgba.push(parseHexAlpha(A ? A + A : 'ff')) // Alpha
      return rgba
    }
  }

  static parseHSL (text) {
    if (this.HSL_REGEX.test(text)) {
      const [, H, S, L, A] = this.HSL_REGEX.exec(text)
      const rgba = parseHSL(H, S, L)
      rgba.push(A || 1)
      return rgba
    }
  }
}

const toFixed = (n, d = 3) => parseFloat(n.toFixed(d))
const maxCap = (v, m = 0, M = 1) => Math.max(m, Math.min(M, v))
const parseValue = (t, m, M, round) => {
  let v = (/%$/.test(t) ? (parseFloat(t.replace(/%$/, '')) / 100) * M : parseFloat(t))
  v = maxCap(v, m, M)
  return round ? Math.round(v) : toFixed(v)
}

// Color regex
Color.RGB_REGEX = /^rgba?\((\d+%?),\s*(\d+%?),\s*(\d+%?)(?:,\s*(\d+(\.\d+)?%?))?\)$/i
const parseRGBValue = n => parseValue(n, 0, 255, true)
const parseRGBAlpha = n => parseValue(n, 0, 255)

Color.HEX_REGEX = /^#?([a-f\d]{6})([a-f\d]{2})?$/i
Color.SIMPLE_HEX_REGEX = /^#?([a-f\d]{3})([a-f\d])?$/i
const parseHexValue = n => parseRGBValue(parseInt(n, 16))
const parseHexAlpha = n => parseRGBAlpha(parseInt(n, 16) / 255)
const toHex = n => n.toString(16).padStart(2, '0')

Color.HSL_REGEX = /^hsla?\((\d+%?),\s*(\d+(?:\.\d+)?%?),\s*(\d+(?:\.\d+)?%?)(?:,\s*(\d+(\.\d+)?%?))?\)$/i
const parseHSL = (H, S, L) => {
  H = parseValue(H, 0, 360)
  S = parseValue(S)
  L = parseValue(L)

  let R = 0
  let G = 0
  let B = 0
  if (S === 0) {
    R = G = B = L
  } else {
    const C = (1 - Math.abs((2 * L) - 1)) * S
    const [r, g, b] = parseHue(H, C)
    const m = L - (C * 0.5)
    R = r + m
    G = g + m
    B = b + m
  }

  return [parseRGBValue(R * 255), parseRGBValue(G * 255), parseRGBValue(B * 255)]
}
const parseHue = (H, C) => {
  const h = H / 60
  const X = C * (1 - Math.abs((h % 2) - 1))
  if (h >= 0 && h <= 1) return [C, X, 0]
  if (h >= 1 && h <= 2) return [X, C, 0]
  if (h >= 2 && h <= 3) return [0, C, X]
  if (h >= 3 && h <= 4) return [0, X, C]
  if (h >= 4 && h <= 5) return [X, 0, C]
  if (h >= 5 && h <= 6) return [C, 0, C]
  return [0, 0, 0]
}

module.exports = Color
