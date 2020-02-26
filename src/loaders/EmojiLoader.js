const { Loader } = require('../')

module.exports = class EmojiLoader extends Loader {
  constructor (client) {
    super({}, client)

    this.officialEmojis = []
  }

  async load () {
    try {
      await this.getAndStoreEmojis()
      this.client.officialEmojis = this.officialEmojis
      this.client.officialEmojis.get = this.getEmoji
      return true
    } catch (e) {
      this.logError(e)
    }
    return false
  }

  /**
   * Fetches and stores all required emojis.
   */
  getAndStoreEmojis () {
    const emojiGuilds = process.env.EMOJI_GUILDS && process.env.EMOJI_GUILDS.split(',')
    if (!emojiGuilds) return this.log(`Required emojis not loaded - Required environment variable "EMOJI_GUILDS" is not set.`, { color: 'red', tags: ['Emojis'] })

    emojiGuilds.map(eg => {
      const filteredEmojis = this.client.emojis.filter(e => e.guild.id === eg)
      filteredEmojis.map(emoji => this.officialEmojis.push(emoji))
    })

    this.log(`All ${this.officialEmojis.length} emojis stored without errors.`, { color: 'green', tags: ['Emojis'] })
  }

  /**
   * Attempts to fetch a required emoji, returns a question mark if not found
   * @param {string} emojiName - Emoji name
   * @param {string} fallback - Replacement for the default question mark fallback emoji
   */
  getEmoji (emojiName, fallback) {
    if (typeof fallback === 'undefined') fallback = '❓'
    const emojis = Object.keys(this).filter(k => parseInt(k))
    if (!emojis) return fallback

    const matchingEmoji = this.find(e => e.name.toLowerCase() === emojiName.toLowerCase())
    if (matchingEmoji) return matchingEmoji.toString()
    else return fallback
  }
}
