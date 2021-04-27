const { ReactionCollector } = require('discord.js')

module.exports = class ReactionHandler extends ReactionCollector {
  constructor (message, filter, options, display, emojis) {
    super(message, filter, options)

    this.display = display
    this.methodMap = new Map(Object.entries(this.display.emojis).map(([key, value]) => [value, key]))
    this.currentPage = this.options.startPage || 0
    this.prompt = this.options.prompt || this.display.t('commons:whichPage')
    this.time = typeof this.options.time === 'number' ? this.options.time : 30 * 1000
    this.awaiting = false
    this.selection = this.display.emojis.zero
      ? new Promise((resolve, reject) => {
          this.reject = reject
          this.resolve = resolve
        })
      : Promise.resolve(null)
    this.reactionsDone = false
    this.infoIsDisplayed = false

    if (emojis.length) this._queueEmojiReactions(emojis.slice())
    else return this.stop()

    this.on('collect', (reaction, handler) => {
      clearTimeout(this.timeout)

      message.reactions.resolve(reaction).users.remove(reaction.users.cache.last())
      this[this.methodMap.get(reaction.emoji.id || reaction.emoji.name)](handler, reaction.users.cache.last())

      this.timeout = setTimeout(() => {
        this.stop()
      }, this.time)
    })

    this.on('end', () => {
      if (this.reactionsDone && !this.message.deleted) this.message.reactions.removeAll()
    })
  }

  first () {
    this.currentPage = 0
    this.update()
  }

  back () {
    if (this.currentPage <= 0) return

    this.currentPage--
    this.update()
  }

  forward () {
    if (this.currentPage > this.display.pages.length - 1) return
    this.currentPage++
    this.update()
  }

  last () {
    this.currentPage = this.display.pages.length - 1
    this.update()
  }

  async jump (handler, author) {
    if (this.awaiting) return
    this.awaiting = true
    const message = await this.message.channel.send(this.prompt)
    const collected = await this.message.channel.awaitMessages(mess => mess.author.id === author.id, { max: 1, time: this.time })
    this.awaiting = false
    await message.delete()
    if (!collected.size) return
    const newPage = parseInt(collected.first().content)
    collected.first().delete()
    if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
      this.currentPage = newPage - 1
      this.update()
    } else {
      message.channel.send(this.display.t('commons:invalidPage'))
        .then(msg => msg.delete({ timeout: 5000 }))
    }
  }

  info () {
    if (this.infoIsDisplayed) {
      this.infoIsDisplayed = false
      this.first()
    } else {
      this.message.edit(this.display.infoPage)
      this.infoIsDisplayed = true
    }
  }

  stop () {
    if (this.resolve) this.resolve(null)
    this.message.reactions.removeAll()
    super.stop()
  }

  update () {
    this.message.edit({ embed: this.display.pages[this.currentPage] })
  }

  async _queueEmojiReactions (emojis) {
    if (this.message.deleted) return this.stop()
    if (this.ended) return this.message.reactions.removeAll()
    await this.message.react(emojis.shift())
    if (emojis.length) return this._queueEmojiReactions(emojis)
    this.reactionsDone = true
    return null
  }
}
