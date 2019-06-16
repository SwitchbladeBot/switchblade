const Command = require('./Command.js')
const CommandError = require('./CommandError.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')

module.exports = class SearchCommand extends Command {
  constructor (client, options) {
    super(client, {
      parameters: options.parameters || [{
        type: 'string', full: true, missingError: 'commons:search.noParams', maxLength: 200, clean: true
      }],
      ...options
    })

    this.parameters = this.mixParameters(this.parameters)
    this.embedColor = options.embedColor
    this.embedLogoURL = options.embedLogoURL
    this.maxResults = options.maxResults || 10
  }

  mixParameters (commandParameters) {
    if (!commandParameters[1]) commandParameters.push([{ type: 'booleanFlag', name: 'lucky', aliases: ['first'] }])
    else commandParameters[1].push({ type: 'booleanFlag', name: 'lucky', aliases: ['first'] })

    return commandParameters
  }

  async run (context, query) {
    const { t, channel, author } = context
    await channel.startTyping()
    const resultsAll = await this.search(context, query)
    if (!Array.isArray(resultsAll)) throw new TypeError(`SearchCommand.search needs to return an array. ${typeof resultsAll} given in ${this.constructor.name}.`)
    const results = resultsAll.slice(0, this.maxResults)

    if (!results) throw new CommandError(t('commons:search.searchFail'))
    if (!results.length) throw new CommandError(t('commons:search.noResults'))
    if (context.flags['lucky']) return this.handleResult(context, results[0]).then(() => channel.stopTyping())
    const description = results.map((item, i) => `\`${this.formatIndex(i, results)}\`. ${this.searchResultFormatter(item, context)}`)
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setTitle(t('commons:search.typeHelper'))
      .setAuthor(t('commons:search.results', { query }), this.embedLogoURL)
      .setDescription(description)
    await channel.send(embed).then(() => channel.stopTyping())

    this.awaitResponseMessage(context, results)
  }

  async search () {
    throw new TypeError(`SearchCommand.search needs return the results in ${this.constructor.name}.`)
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

  handleResult () {
    throw new TypeError(`SearchCommand.handleResult should handle the result in ${this.constructor.name}.`)
  }
}
