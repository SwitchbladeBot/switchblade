const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class LeagueOfLegendsRotation extends Command {
  constructor (client) {
    super({
      name: 'rotation',
      aliases: ['r'],
      parent: 'leagueoflegends',
      parameters: [[{
        type: 'booleanFlag', name: 'newplayers', aliases: ['np']
      }]]
    }, client)
  }

  async run ({ t, author, channel, language, flags }) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const parentCommand = this.parentCommand
    const lolApi = this.client.apis.lol
    try {
      const rotation = await lolApi.fetchChampionRotation()
      const champions = flags['newplayers'] ? rotation.freeChampionIdsForNewPlayers : rotation.freeChampionIds
      const championPayload = await Promise.all(champions.map(async c => {
        var payload = await lolApi.fetchChampion(c, language, true)
        return `**${payload.name}**, ${payload.title}`
      }))
      embed.setColor(parentCommand.embedColor)
        .setAuthor(t(parentCommand.authorString), parentCommandauthorImage, parentCommand.authorURL)
        .setTitle(t('commands:leagueoflegends.subcommands.rotation.weeklyChampRotation'))
        .setDescription(championPayload.join('\n'))
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
