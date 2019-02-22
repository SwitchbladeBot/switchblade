const { Command, SwitchbladeEmbed } = require('../../../')

module.exports = class Leaderboard extends Command {
  constructor (client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['top', 'ranking'],
      category: 'social',
      requirements: { databaseOnly: true, canvasOnly: true }
    })
  }

  async run ({ t, author, prefix, alias, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription(this.subcommands.map(subcmd => {
      return `**${prefix}${subcmd.fullName}** - ${t(`commands:${subcmd.tPath}.commandDescription`)}`
    }).join('\n'))
    channel.send(embed)
  }
}
