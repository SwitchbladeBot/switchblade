const { Command, SwitchbladeEmbed, CommandError } = require('../../../')
module.exports = class LeagueOfLegendsSkin extends Command {
  constructor (client) {
    super({
      name: 'skin',
      aliases: ['s'],
      requirements: { apis: ['youtube', 'lol'] },
      parent: 'leagueoflegends',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:leagueoflegends.subcommands.skin.noSkin'
      }]
    }, client)
  }
  async run ({ t, author, channel }, skin) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const { name, splashUrl } = await this.client.apis.lol.fetchSkin(skin)
      const { embedColor, authorString, authorImage, authorURL } = this.parentCommand
      const { items } = await this.client.apis.youtube.search(`${name} Skin Spotlight`, ['video'])

      const videoId = items.find(i => i.snippet.channelTitle === 'SkinSpotlights').id.videoId
      const videoUrl = `https://youtube.com/watch?v=${videoId}`

      embed.setColor(embedColor)
        .setAuthor(t(authorString), authorImage, authorURL)
        .setTitle(name)
        .setImage(splashUrl)
        .setDescription(t('commands:leagueoflegends.subcommands.skin.description', { videoUrl }))
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      console.error(e)
      throw new CommandError(t('commands:leagueoflegends.subcommands.skin.anErrorOcurred'))
    }
  }
}
