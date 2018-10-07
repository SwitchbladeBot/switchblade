const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class Leaderboard extends Command {
  constructor (client) {
    super(client)
    this.name = 'leaderboard'
    this.aliases = ['top', 'ranking']
    this.subcommands = [new MoneyLeaderboard(client, this)]

    this.requirements = new CommandRequirements(this, {databaseOnly: true})
  }

  async run ({ t, author, prefix, alias, channel, guildDocument }) {
    const embed = new SwitchbladeEmbed(author)
    channel.send(embed)
  }
}

class MoneyLeaderboard extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'money'
    this.aliases = ['balance']
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const top = await this.client.database.users.findAll().then(users => users.sort((a, b) => b.money - a.money).splice(0, 10))
    const ranking = await top.map(u => u.id)
    embed
      .setTitle(t('commands:leaderboard.subcommands.money.successTitle'))
      .setDescription(top.map(u => {
        const user = this.client.users.get(u.id)
        return `#${ranking.indexOf(u.id) + 1} **${user ? user.tag : u.id}** - ${t('commons:currencyWithCount_plural', { count: u.money })}`
      }).join('\n'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
