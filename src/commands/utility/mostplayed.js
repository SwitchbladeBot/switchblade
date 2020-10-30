const { Command, SwitchbladeEmbed, MiscUtils } = require('../../')

module.exports = class MostPlayed extends Command {
  constructor (client) {
    super({
      name: 'mostplayed',
      aliases: ['topgames'],
      category: 'utility',
      requirements: { guildOnly: true }
    }, client)
  }

  run ({ message, t, channel, language }) {
    channel.startTyping()
    const games = {}

    message.guild.members.cache.filter(member => !member.user.bot && member.presence.activities.length).each(member => {
      member.presence.activities.filter(activity => activity.type === 'PLAYING').forEach(activity => {
        games[activity.name] = games[activity.name] + 1 || 1
      })
    })

    const gamesList = Object.keys(games)
    const mostPlayed = gamesList.sort((a, b) => games[b] - games[a]).slice(0, 20)
    const totalPlayers = gamesList.length
      ? Object.values(games).reduce((acc, val) => acc + val)
      : 0

    channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setTitle(t('commands:mostplayed.mostPlayedTitle', { name: message.guild.name }))
        .setDescription(mostPlayed.length
          ? mostPlayed.map((game, i) => t('commands:mostplayed.hasPlayers', { rank: i + 1, game, count: MiscUtils.formatNumber(games[game], language) }))
          : t('commands:mostplayed.noPlayers'))
        .setFooter(t('commands:mostplayed.totalPlayers', { count: MiscUtils.formatNumber(totalPlayers, language) }))
    ).then(() => channel.stopTyping(true))
  }
}
