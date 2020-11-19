const { MessageEmbed, TextChannel, DMChannel, Message } = require('discord.js')
const ReactionHandler = require('./ReactionHandler.js')

const validateProp = (prop) => typeof prop !== 'undefined' ? prop : true

/**
 * Paginated embed constructor, so that one can incorporate multiple embeds into one.
 * @constructor
 * @param {object} [t] - i18next translation object
 * @param {User} [author] - The user that executed the command that resulted in this embed
 * @param {Array[MessageEmbed]} [pages] - Array of embeds that can be used if you don't want to call the addPage() function too many times
 */
module.exports = class PaginatedEmbed {
  constructor (t, author, pages = [], embed = new MessageEmbed()) {
    this.t = t
    this.author = author
    this.embedTemplate = embed
    this.pages = []
    this.infoPage = null

    this.emojis = {
      first: '⏮',
      back: '◀',
      forward: '▶',
      last: '⏭',
      jump: '🔢',
      info: 'ℹ',
      stop: '⏹'
    }

    pages.forEach(page => this.addPage(page))
  }

  /**
     * Sets emojis, if you don't want the default ones. ¯\_(ツ)_/¯
     * @param {object} [emojis] - Object with emojis to be edited.
     * @returns {PaginatedEmbed}
     */
  setEmojis (emojis) {
    Object.assign(this.emojis, emojis)
    return this
  }

  /**
     * Adds a embed to the list of embeds to be rendered
     * @param {MessageEmbed} [embed] - MessageEmbed object
     * @returns {PaginatedEmbed}
     */
  addPage (embed) {
    this.pages.push(this._handlePageGeneration(embed))
    return this
  }

  /**
     * Sets an info embed
     * @param {MessageEmbed} [embed] - MessageEmbed object
     * @returns {PaginatedEmbed}
     */
  setInfoPage (embed) {
    this.infoPage = this._handlePageGeneration(embed)
    return this
  }

  /**
  * Renders the paginated embed
  * @param {Channel} channel - Discord.js TextChannel
  * @param {object} options - ReactionCollector options
  * @returns {ReactionHandler}
  */
  async run (target, options = {}) {
    this._footer()
    if (!options.filter) options.filter = () => true
    const emojis = this._determineEmojis(
      [],
      validateProp(options.stop),
      validateProp(options.jump),
      validateProp(options.firstLast)
    )

    let msg
    if (target instanceof TextChannel || target instanceof DMChannel) {
      msg = await target.send(this.pages[options.startPage || 0])
    } else if (target instanceof Message) {
      msg = await target.edit({ embed: this.pages[options.startPage || 0] })
    } else {
      throw new TypeError('Invalid "target" parameter type, must be "TextChannel", "DMChannel" or "Message".')
    }

    return new ReactionHandler(
      msg,
      (reaction, user) => emojis.includes(reaction.emoji.id || reaction.emoji.name) && user !== target.client.user && user === this.author && options.filter(reaction, user),
      options,
      this,
      emojis
    )
  }

  async _footer () {
    this.pages.forEach((page, index) => page.setFooter(`${index + 1}/${this.pages.length}`))
    if (this.infoPage) this.infoPage.setFooter('ℹ')
  }

  _determineEmojis (emojis, stop, jump, firstLast) {
    if (this.pages.length > 1 || this.infoPage) {
      if (firstLast) emojis.push(this.emojis.first, this.emojis.back, this.emojis.forward, this.emojis.last)
      else emojis.push(this.emojis.back, this.emojis.forward)
    }
    if (this.infoPage) emojis.push(this.emojis.info)
    if (stop) emojis.push(this.emojis.stop)
    if (jump) emojis.push(this.emojis.jump)
    return emojis
  }

  _handlePageGeneration (cb) {
    if (typeof cb === 'function') {
      const page = cb(this.embedTemplate)
      if (page instanceof MessageEmbed) return page
    } else if (cb instanceof MessageEmbed) {
      return cb
    }
    throw new Error('Expected a MessageEmbed or Function returning a MessageEmbed')
  }
}
