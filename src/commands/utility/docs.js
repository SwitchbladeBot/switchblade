const { Command } = require('../../')
const fetch = require('node-fetch')

module.exports = class Docs extends Command {
  constructor (client) {
    super({
      name: 'docs',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:docs.noQueryProvided'
      }]
    }, client)
  }

  async run ({ channel }, query) {
    const queryParams = new URLSearchParams({ src: 'stable', q: query })
    const embed = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryParams.toString()}`)
      .then(res => res.json())

    channel.send({ embed }).then(() => channel.stopTyping())
  }
}
