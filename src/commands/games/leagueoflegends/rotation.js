const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class LeagueOfLegendsRotation extends Command {
  constructor (client) {
    super(client, {
      name: 'rotation',
      aliases: ['r'],
      parentCommand: 'leagueoflegends',
      requirements: { apis: ['lol'] },
      parameters: [{
        type: 'booleanFlag', name: 'newplayer', aliases: ['np']
      }]
    })
  }

  async run ({ t, channel, author, flags, language }) {
    channel.startTyping()
    try {
      const paginatedEmbed = new SwitchbladeEmbed.PaginatedEmbed(t)

      const rotation = await this.client.apis.lol.fetchChampionRotation()
      const locale = await this.client.apis.lol.getLocale(language)
      const champions = flags['newplayer'] ? rotation.freeChampionIdsForNewPlayers : rotation.freeChampionIds

      for (var i in champions) {
        const champion = await this.client.apis.lol.fetchChampionById(champions[i], language)
        const embed = await this.parentCommand.generateEmbed(champion, locale, author, t)
        paginatedEmbed.addPage(embed)
      }

      paginatedEmbed.run(await channel.send('Fetching...'))
      channel.stopTyping()
    } catch (e) {
      throw new CommandError(e.toString())
    }
  }
}
