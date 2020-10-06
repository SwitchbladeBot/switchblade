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
    const { embedColor, authorString, authorImage, authorURL } = this.parentCommand
    try {
      const { freeChampionIdsForNewPlayers, freeChampionIds } = await this.client.apis.lol.fetchChampionRotation()
      const champions = flags.newplayers ? freeChampionIdsForNewPlayers : freeChampionIds
      const championPayload = await Promise.all(champions.map(async c => {
        const { name, title } = await this.client.apis.lol.fetchChampion(c, language, true)
        return `**${name}**, ${title}`
      }))
      embed.setColor(embedColor)
        .setAuthor(t(authorString), authorImage, authorURL)
        .setTitle(t('commands:leagueoflegends.subcommands.rotation.weeklyChampRotation'))
        .setDescription(championPayload.join('\n'))
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
