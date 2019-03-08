const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class Restart extends Command {
  constructor(client) {
    super(client)
    this.name = 'restart'
    this.aliases = ['rs']
    this.category = 'developers'
    this.hidden = true

    this.requirements = new CommandRequirements(this, { devOnly: true })
  }

  async run({ message }) {
    const embed = new SwitchbladeEmbed(;

    message.channel.send(embed
      .setTitle('Service Restart')
      .setDescription('Restarting...')
    ).then(message.client.destroy()).then(message.client.login());
  }
}
