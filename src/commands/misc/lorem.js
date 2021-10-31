const { SwitchbladeEmbed, Command } = require('../../')
const LoremIpsum = require('lorem-ipsum').LoremIpsum

module.exports = class Lorem extends Command {
  constructor (client) {
    super({
      name: 'lorem',
      parameters: [{
        type: 'number',
        full: true,
        missingError: 'commands:lorem.notFound',
        required: true
      }]
    },
    client)

    this.lorem = new LoremIpsum()
  }

  async run ({ channel }, paragraphs) {
    const embed = new SwitchbladeEmbed()
      .setDescription(this.lorem.generateParagraphs(paragraphs))

    channel.send(embed)
  }
}
