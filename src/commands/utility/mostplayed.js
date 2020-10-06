const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class MostPlayed extends Command {
  constructor (client) {
    super({
      name: 'mostplayed',
      aliases: ['topgames'],
      category: 'utility',
      requirements: { guildOnly: true },
      parameters: [{
        type: 'guild',
        full: true,
        required: false
      }]
    }, client)
  }

  run ({ t, channel, language }, guild = channel.guild) {
    const embed = new SwitchbladeEmbed()
    channel.startTyping()
    const games = {}

    guild.members.cache.filter(member => !member.user.bot && member.presence.activities.length).each(member => {
      member.presence.activities.filter(activity => activity.type === 'PLAYING').forEach(activity => {
        games[activity.name] = games[activity.name] + 1 || 1
      })
    })

    const gamesList = Object.keys(games)
    const mostPlayed = gamesList.sort((a, b) => games[b] - games[a]).slice(0, 20)

    embed.setThumbnail(guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : `https://guild-default-icon.herokuapp.com/${guild.nameAcronym}`)
      .setTitle('Most played games')
      .setDescription(mostPlayed.length
        ? mostPlayed.map((game, i) => `${i + 1}. **${game}** - ${games[game]} players`)
        : 'Nobody is playing games here!')

    channel.send(embed).then(() => channel.stopTyping())
  }
}
