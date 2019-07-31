const { Command, SwitchbladeEmbed, CommandError } = require('../../')

module.exports = class Raffle extends Command {
  constructor (client) {
    super(client, {
      name: 'raffle',
      parameters: [{
        type: 'number', required: false, min: 1, max: 50
      }, {
        type: 'role', required: false, full: true
      }]
    })
  }

  run ({ t, author, channel, guild }, amount = 1, role) {
    if (amount > guild.members.size) throw new CommandError(t('commands:raffle.amountTooHighGuild'))
    if (role && amount > role.members.size) throw new CommandError(t('commands:raffle.amountTooHighRole'))

    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const users = role ? guild.members.filter(m => m.roles.has(role.id)) : guild.members
    const raffledUsers = users.filter(m => !m.user.bot).map(u => u.toString())
    const chosen = []

    for (let i = 0; i < amount; i++) {
      chosen.push(raffledUsers[Math.floor(Math.random() * raffledUsers.length)])
    }

    embed.setTitle(t('commands:raffle.raffle'))
      .setDescriptionFromBlockArray([
        [
          amount === 1 ? t('commands:raffle.winnerSingular') : t('commands:raffle.winnerPlural')
        ],
        chosen
      ])

    channel.send(embed).then(() => channel.stopTyping())
  }
}
