const { Command, SwitchbladeEmbed, CommandStructures } = require('../../')
const { CommandParameters, StringParameter, CommandError } = CommandStructures

module.exports = class SearchCommand extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.embedColor = null
    this.embedLogoURL = null
    this.maxResults = 10

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commons:search.noParams' })
    )
  }

  async run (context, query) {
    const { t, channel, author } = context
    await channel.startTyping()
    const resultsAll = await this.search(context, query)
    const results = resultsAll.slice(0, this.maxResults)

    if (!results) throw new CommandError(t('commons:search.searchFail'))
    const description = results.map((item, i) => `\`${this.formatIndex(i, results)}\`. ${this.searchResultFormatter(item)}`)
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setTitle(t('commons:search.typeHelper'))
      .setAuthor(t('commons:search.results', { query }), this.embedLogoURL)
      .setDescription(description)
    await channel.send(embed).then(() => channel.stopTyping())

    this.awaitResponseMessage(context, results)
  }

  async search (context, query) {
    return null
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
          const result = results[Number(collected.first().content) - 1]
          this.handleResult(context, result)
        }
      })
  }

  verifyCollected (selected, length) {
    const number = Number(selected)
    return number <= length && !isNaN(number) && number > 0
  }

  handleResult (context, result) {
    return null
  }
}
