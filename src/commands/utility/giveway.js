const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Giveway extends Command {
  constructor (client) {
    super(client, {
      name: 'giveway',
      category: 'utility',
      aliases: ['gw']
    })
  }

  run ({ t, author, channel, prefix }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(this.subcommands.map(subcmd => (
          `**${prefix}${subcmd.fullName}** - ${t(`commands:${subcmd.tPath}.commandDescription`)}`
        )).join('\n'))
    )
  }
}
