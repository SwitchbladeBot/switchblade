const { MessageEmbed } = require('discord.js')
const ReactionHandler = require('./ReactionHandler.js')

/**
 * A MessageEmbed with the default fields already filled
 * @constructor
 * @param {User} [user] - The user that executed the command that resulted in this embed
 * @param {object} [data] - Data to set in the rich embed
 */
module.exports = class SwitchbladeEmbed extends MessageEmbed {
  constructor (user, data = {}) {
    super(data)
    this.setColor(process.env.EMBED_COLOR).setTimestamp()
    if (user) this.setFooter(user.tag)
  }

  /**
   * Sets the description of this embed based on an array of arrays of strings
   * @param {Array<Array>} Array containing arrays (blocks) of and strings
   * @returns {SwitchbladeEmbed}
   */
  setDescriptionFromBlockArray (blocks) {
    this.description = blocks.map(lines => lines.filter(l => !!l).join('\n')).filter(b => !!b.length).join('\n\n')
    return this
  }
}

/**
 * Paginated embed constructor, so that one can incorporate multiple embeds into one.
 * @constructor
 * @param {object} [t] - i18next translation object
 * @param {User} [author] - The user that executed the command that resulted in this embed
 */
module.exports.PaginatedEmbed = class PaginatedEmbed {
  constructor (t, author, embed = new MessageEmbed()) {
    this.t = t
    this.author = author
    this.embedTemplate = embed
    this.pages = []
    this.informationPage = null

    this.emojis = {
      first: '⏮',
      back: '◀',
      forward: '▶',
      last: '⏭',
      jump: '🔢',
      info: 'ℹ',
      stop: '⏹'
    }
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
   * @param {Message} message - Discord.js message
   * @param {object} options - ReactionCollector options
   * @returns {ReactionHandler}
   */
  async run (message, options = {}) {
    this._footer()
    if (!options.filter) options.filter = () => true
    const emojis = this._determineEmojis(
      [],
      !('stop' in options) || ('stop' in options && options.stop),
      !('jump' in options) || ('jump' in options && options.jump),
      !('firstLast' in options) || ('firstLast' in options && options.firstLast)
    )

    let msg
    if (message.editable) {
      await message.edit({ embed: this.pages[options.startPage || 0] })
      msg = message
    } else {
      msg = await message.channel.send(this.pages[options.startPage || 0])
    }

    return new ReactionHandler(
      msg,
      (reaction, user) => emojis.includes(reaction.emoji.id || reaction.emoji.name) && user !== message.client.user && user === this.author && options.filter(reaction, user),
      options,
      this,
      emojis
    )
  }

  async _footer () {
    for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${i}/${this.pages.length}`)
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
      // eslint-disable-next-line callback-return
      const page = cb(this.template)
      if (page instanceof MessageEmbed) return page
    } else if (cb instanceof MessageEmbed) {
      return cb
    }
    throw new Error('Expected a MessageEmbed or Function returning a MessageEmbed')
  }
}
