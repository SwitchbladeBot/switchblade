const Command = require('./Command.js')
const CommandError = require('./CommandError.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')

module.exports = class SearchCommand extends Command {
  constructor (client, options) {
    super(client, {
      parameters: [{
        type: 'string', full: true, missingError: 'commons:search.noParams', maxLength: 200, clean: true
      }],
      ...options
    })

    this.embedColor = options.embedColor
    this.embedLogoURL = options.embedLogoURL
    this.maxResults = options.maxResults || 10
  }

  async run (context, query) {
    const { t, channel, author } = context
    await channel.startTyping()
    const resultsAll = await this.search(context, query)
    const results = resultsAll.slice(0, this.maxResults)

    if (!results) throw new CommandError(t('commons:search.searchFail'))
    if (!results.length) throw new CommandError(t('commons:search.noResults'))
    const description = results.map((item, i) => `\`${this.formatIndex(i, results)}\`. ${this.searchResultFormatter(item, context)}`)
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setTitle(t('commons:search.typeHelper'))
      .setAuthor(t('commons:search.results', { query }), this.embedLogoURL)
      .setDescription(description)
    await channel.send(embed).then(() => channel.stopTyping())

    this.awaitResponseMessage(context, results)
  }

  async search ({ t }) {
    throw new CommandError(t('errors:generic'))
  }

  searchResultFormatter (item) {
    return item
  }

  formatIndex (index, results) {
    index++
    if (results.length < 10) return index
    return index.toString().padStart(2, '0')
  }

  async awaitResponseMessage (context, results) {
    const { author, channel } = context
    const filter = c => c.author.equals(author) && this.verifyCollected(c.content, results.length)

    channel.awaitMessages(filter, { time: 10000, max: 1 })
      .then(collected => {
        if (collected.size > 0) {
          const result = results[Math.round(Number(collected.first().content)) - 1]
          this.handleResult(context, result)
        }
      })
  }

  verifyCollected (selected, length) {
    const number = Math.round(Number(selected))
    return number <= length && !isNaN(number) && number > 0
  }

  handleResult ({ t }) {
    throw new CommandError(t('errors:generic'))
  }
}
