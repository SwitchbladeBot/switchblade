const { Command } = require('../../')
const figlet = require('figlet')

module.exports = class Asciify extends Command {
  constructor (client) {
    super(client, {
      name: 'asciify',
      aliases: ['bigtext'],
      parameters: [{
        type: 'string', full: true, clean: true, missingError: 'commands:asciify.noText'
      }]
    })
  }

  run ({ channel, message }, text) {
    const bigtext = figlet.textSync(text, {
      font: 'Big',
      horizontalLayout: 'universal smushing',
      verticalLayout: 'universal smushing'
    })
    channel.send(`\`\`\`${bigtext}\`\`\``)
  }
}
