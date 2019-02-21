const { CommandStructures } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const cowsay = require('cowsay')

module.exports = class Cowsay extends Command {
  constructor (client) {
    super(client, {
      name: 'cowsay',
      aliases: ['cs'],
      category: 'general',
      parameters: [{
        type: 'string', full: true, clean: true, missingError: 'commands:cowsay.noText'
      }]
    })
  }

  run ({ channel, message }, text) {
    channel.send(`\`\`\`${cowsay.say({ text })}\`\`\``)
  }
}
