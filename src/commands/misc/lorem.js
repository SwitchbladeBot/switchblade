const { SwitchbladeEmbed, Command } = require('../../')
const { LoremIpsum } = require('lorem-ipsum')

module.exports = class Lorem extends Command {
  constructor (client) {
    super({
      name: 'lorem',
      parameters: [{
        type: 'number',
        full: true,
        missingError: 'commands:lorem.noNumber',
        required: false,
        min: 1,
        max: 10
      }]
    },
    client)

    this.lorem = new LoremIpsum()
  }

  async run ({ channel, t }, paragraphs) {
    const loremString = this.lorem.generateParagraphs(paragraphs || 2)

    const embed = new SwitchbladeEmbed()
      .setDescription(loremString)

    channel.send(embed)
  }
}
