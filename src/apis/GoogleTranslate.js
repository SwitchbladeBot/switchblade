const { APIWrapper } = require('../')
const fetch = require('node-fetch')

module.exports = class GoogleTranslate extends APIWrapper {
  constructor () {
    super({
      name: 'gtranslate'
    })
  }

  /**
   * Translates a text from a language to another.
   * @param {string} from
   * @param {string} to
   * @param {string} text
   * @returns {Promise<{original: string, from: string, translated: string, to: string}>}
   */
  async translateText (from, to, text) {
    const params = {
      sl: from,
      tl: to,
      q: text
    }

    const URLqueryParams = new URLSearchParams(params)
    const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&dt=t' + `&${URLqueryParams.toString()}`)
      .then(res => res.json())

    return {
      translated: res[0][0][0],
      original: res[0][0][1],
      from: res[2],
      to: to
    }
  }
}
