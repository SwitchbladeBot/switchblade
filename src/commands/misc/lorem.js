const { SwitchbladeEmbed, Command, CommandError } = require('../../')
const { LoremIpsum } = require('lorem-ipsum')

module.exports = class Lorem extends Command {
  constructor (client) {
    super({
      name: 'lorem',
      parameters: [{
        type: 'number',
        full: true,
        missingError: 'commands:lorem.noNumber',
        required: true
      }]
    },
    client)

    this.lorem = new LoremIpsum()
  }

  async run ({ channel , t}, paragraphs) {
    if(paragraphs > 4096 || paragraphs < 1){
      throw new CommandError(t("commands:lorem.exceededNumber"))
    }
    const embed = new SwitchbladeEmbed()
      .setDescription(this.lorem.generateParagraphs(paragraphs))

    channel.send(embed)
  }
}
