const { Loader } = require('../')
const fetch = require('node-fetch')

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
  async getAndStoreEmojis () {
    const emojiGuilds = process.env.EMOJI_GUILDS && process.env.EMOJI_GUILDS.split(',')
    if (!emojiGuilds) return this.log('Required emojis not loaded - Required environment variable "EMOJI_GUILDS" is not set.', { color: 'red', tags: ['Emojis'] })

    await Promise.all(emojiGuilds.map(async guild => {
      return fetch(`${this.client.options.http.api}/v${this.client.options.http.version}/guilds/${guild}/emojis`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
      }).then(res => res.json()).then(emojis => {
        if (emojis) this.officialEmojis = this.officialEmojis.concat(emojis)
        this.log(`Loaded ${emojis.length || 0} emojis from ${guild}.`, { color: 'green', tags: ['Emojis'] })
      }).catch(e => {
        this.log(`Failed to fetch emojis from ${guild}`, { color: 'yellow', tags: ['Emojis'] })
      })
    }))

    this.log(`All ${this.officialEmojis.length} emojis stored without errors.`, { color: 'green', tags: ['Emojis'] })
  }

  /**
   * Attempts to fetch a required emoji, returns a question mark if not found
   * @param {string} emojiName - Emoji name
   * @param {string} fallback - Replacement for the default question mark fallback emoji
   */
  getEmoji (emojiName, fallback) {
    if (typeof fallback === 'undefined') fallback = '❓'
    if (this.length === 0) return fallback
    const matchingEmoji = this.find(e => e.name && e.name.toLowerCase() === emojiName.toLowerCase())
    if (matchingEmoji) return `<:${matchingEmoji.name}:${matchingEmoji.id}>`
    else return fallback
  }
}
