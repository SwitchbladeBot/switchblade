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
        required: false,
        min: 1,
        max: 100,
      }]
    },
    client)

    this.lorem = new LoremIpsum()
  }

  async run ({ channel, t }, words) {
    if(words === undefined) {
      words = 20
    }

    if (words > 4096 || words < 1) {
      throw new CommandError(t('commands:lorem.exceededNumber'))
    }
    const embed = new SwitchbladeEmbed()
      .setDescription(this.lorem.generateWords(words))

    channel.send(embed)
  }
}
