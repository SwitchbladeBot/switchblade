const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

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
    const res = await snekfetch.get('https://translate.googleapis.com/translate_a/single?client=gtx&dt=t').query(params).then(r => r.body)

    return {
      translated: res[0][0][0],
      original: res[0][0][1],
      from: res[2],
      to: to
    }
  }
}
