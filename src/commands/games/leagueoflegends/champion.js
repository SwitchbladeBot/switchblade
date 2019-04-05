const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class LeagueOfLegendsChampion extends Command {
  constructor (client) {
    super(client, {
      name: 'champion',
      aliases: ['champ', 'c'],
      parentCommand: 'leagueoflegends',
      requirements: { apis: ['lol'] },
      parameters: [{
        type: 'string', full: true, missingError: 'commands:leagueoflegends.subcommands.champion.noChampion'
      }]
    })
  }

  async run ({ t, author, channel, language }, champion) {
    channel.startTyping()
    try {
      const champ = await this.client.apis.lol.fetchChampionByName(champion, language)
      const locale = await this.client.apis.lol.getLocale(language)
      const embed = await this.parentCommand.generateEmbed(champ, locale, author, t)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      console.log(e)
      throw new CommandError(t('commands:leagueoflegends.subcommands.champion.invalidChamp'))
    }
  }
}
