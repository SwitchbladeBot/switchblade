const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

const snekfetch = require('snekfetch')

const baseURL = 'https://hastebin.com'

module.exports = class Hastebin extends Command {
  constructor (client) {
    super(client)
    this.name = 'hastebin'
    this.aliases = ['haste']

    this.category = 'utility'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:npm.noNameProvided' })
    )
  }

  async run ({ t, author, channel, message }, code) {
    const { body } = await snekfetch.post(`${baseURL}/documents`).set('Content-Type', 'application/json').send(message.content)
    channel.send(`${baseURL}/${body.key}`)
  }
}
