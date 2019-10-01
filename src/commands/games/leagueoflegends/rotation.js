const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class LeagueOfLegendsRotation extends Command {
  constructor (client) {
    super(client, {
      name: 'rotation',
      aliases: ['r'],
      parentCommand: 'leagueoflegends',
      requirements: { apis: ['lol'] },
      parameters: [[{
        type: 'booleanFlag', name: 'newplayers', aliases: ['np']
      }]]
    })
  }

  async run ({ t, author, channel, language, flags }) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const rotation = await this.client.apis.lol.fetchChampionRotation()
      const champions = flags.newplayers ? rotation.freeChampionIdsForNewPlayers : rotation.freeChampionIds
      const championPayload = await await Promise.all(champions.map(async c => {
        var payload = await this.client.apis.lol.fetchChampion(c, language, true)
        return `**${payload.name}**, ${payload.title}`
      }))
      embed.setColor(this.parentCommand.LOL_COLOR)
        .setAuthor('League of Legends', this.parentCommand.LOL_LOGO, 'https://leagueoflegends.com')
        .setTitle(t('commands:leagueoflegends.subcommands.rotation.weeklyChampRotation'))
        .setDescription(championPayload.join('\n'))
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
