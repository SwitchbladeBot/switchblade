const { Command } = require('../..')
const fetch = require('node-fetch')
const VALID_SOURCES = ['stable', 'master', 'commando', 'rpc', 'akairo-master', 'collection']

module.exports = class DjsDocs extends Command {
  constructor (client) {
    super({
      name: 'djsdocs',
      aliases: ['djdocs'],
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        clean: false,
        missingError: 'commands:docs.noQueryProvided'
      }, [{
        type: 'string',
        name: 'source',
        aliases: ['src'],
        required: false
      }]]
    }, client)
  }

  async run ({ channel, flags }, query) {
    const { source } = flags
    const src = VALID_SOURCES.includes(source) ? source : 'stable'

    const queryParams = new URLSearchParams({ src, q: query })
    const embed = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryParams.toString()}`)
      .then(res => res.json())

    channel.send({ embed }).then(() => channel.stopTyping())
  }
}
