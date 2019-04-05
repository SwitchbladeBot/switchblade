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

      const champions = await this.client.apis.lol.fetchChampionRotation(language, flags['newplayer'])
      const locale = await this.client.apis.lol.getLocale(language)

      for (var i in champions) {
        const embed = await this.parentCommand.generateEmbed(champions[i], locale, author, t)
        paginatedEmbed.addPage(embed)
      }

      paginatedEmbed.setInfoPage(
        new SwitchbladeEmbed(author)
          .setColor(this.parentCommand.LOL_COLOR)
          .setAuthor('League of Legends', this.parentCommand.LOL_LOGO, 'https://leagueoflegends.com')
          .setTitle(t('commands:leagueoflegends.subcommands.rotation.rotation'))
          .setDescription(champions.map(champ => `**${champ.name}**, ${champ.title}`).join('\n'))
      )

      paginatedEmbed.run(await channel.send('...'))
      channel.stopTyping()
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.champion.invalidChamp'))
    }
  }
}
