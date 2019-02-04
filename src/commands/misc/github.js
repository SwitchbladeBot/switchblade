const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter, CommandRequirements } = CommandStructures

const types = ['user', 'u', 'repository', 'repo', 'organization', 'org']

module.exports = class GitHub extends Command {
  constructor (client) {
    super(client)

    this.name = 'github'
    this.aliases = ['gh']
    this.requirements = new CommandRequirements(this, { apis: ['github'] })

    this.GITHUB_LOGO = 'https://i.imgur.com/gsY6oYB.png'

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: false,
        whitelist: types,
        required: true,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:github.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:github.types')}:**__`,
              `\`${['user', 'repository', 'organization'].join('`, `')}\``
            ].join('\n'))
        }
      })
    )
  }

  formatIndex (index) {
    return index.toString().padStart(2, '0')
  }

  async searchHandler (query, prefix) {
    if (!prefix) prefix = (obj, i) => `\`${this.formatIndex(++i)}\`. [${obj.full_name}](${obj.html_url})`

    const results = await this.client.apis.github.findRepositories(query, 10)
    return results ? { description: results.map(prefix), ids: results.map(r => r.full_name) } : false
  }

  verifyCollected (selected, length) {
    const number = Math.round(Number(selected))
    if (isNaN(number)) return false
    if (number < 1) return false
    return number <= length
  }

  async awaitResponseMessage (message, ids, callback) {
    const filter = c => c.author.equals(message.author) && this.verifyCollected(c.content, ids.length)

    message.channel.awaitMessages(filter, { time: 10000, max: 1 })
      .then(collected => {
        if (collected.size > 0) callback(ids[Math.round(Number(collected.first().content)) - 1])
      })
  }
}
