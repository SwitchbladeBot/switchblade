const { CanvasTemplates, CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures
const { Attachment } = require('discord.js')

module.exports = class Leaderboard extends Command {
  constructor (client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['top', 'ranking'],
      category: 'social',
      requirements: { databaseOnly: true, canvasOnly: true },
      subcommands: [
        new MoneyLeaderboard(client, this),
        new ReputationLeaderboard(client, this)
      ]
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

class MoneyLeaderboard extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'money'
    this.aliases = [ 'balance', 'switchcoins' ]
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    const top = await this.client.modules.social.leaderboard('money')
    const leaderboard = await CanvasTemplates.leaderboard({ t }, top, {
      icon: Constants.COINS_SVG,
      iconWidth: 48,
      iconHeight: 48,
      title: t(`commands:${this.tPath}.title`).toUpperCase(),
      valueFunction: (u) => t('commons:currencyWithCount_plural', { count: u.money })
    })

    channel.send(new Attachment(leaderboard, 'leaderboard.jpg')).then(() => channel.stopTyping())
  }
}

class ReputationLeaderboard extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'reputation'
    this.aliases = [ 'rep' ]
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    const top = await this.client.modules.social.leaderboard('rep')
    const leaderboard = await CanvasTemplates.leaderboard({ t }, top, {
      icon: Constants.REPUTATION_SVG,
      iconWidth: 48,
      iconHeight: 48,
      title: t(`commands:${this.tPath}.title`).toUpperCase(),
      valueFunction: (u) => t('commons:reputationWithCount', { count: u.rep })
    })

    channel.send(new Attachment(leaderboard, 'leaderboard.jpg')).then(() => channel.stopTyping())
  }
}
