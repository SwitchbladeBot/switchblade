const { SwitchbladeEmbed, Command } = require('../../')
const { LoremIpsum } = require('lorem-ipsum')

module.exports = class Lorem extends Command {
  constructor (client) {
    super({
      name: 'lorem',
      parameters: [{
        type: 'number',
        missingError: 'commands:lorem.noNumber',
        required: false,
        min: 1,
        max: 10
      }]
    },
    client)

    this.lorem = new LoremIpsum()
  }

  async run ({ channel, t }, paragraphs = 2) {
    let loremString = this.lorem.generateParagraphs(paragraphs)

    if (loremString.length >= 4096) {
      loremString = loremString.slice(0, 4095) + '…'
    }

    const embed = new SwitchbladeEmbed()
      .setDescription(loremString)

    channel.send(embed)
  }
}
