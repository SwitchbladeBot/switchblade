const { CommandStructures } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')

module.exports = class Cowsay extends Command {
  constructor (client) {
    super(client)
    this.name = 'cowsay'
    this.aliases = ['cs']
	
	this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:cowsay.noText'})
    )
  }

  async run ({ channel }, text) {
    const { body } = await snekfetch.get(`http://cowsay.morecode.org/say?message=${text}&format=json`)
    channel.send(`\`\`\`${body.cow}\`\`\``)
  }
}
