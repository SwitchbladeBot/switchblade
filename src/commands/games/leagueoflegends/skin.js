const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class LeagueOfLegendsSkin extends Command {
  constructor (client) {
    super({
      name: 'skin',
      aliases: ['s'],
      parent: 'leagueoflegends',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:leagueoflegends.subcommands.skin.noSkin'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, skin) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const { name, splashUrl, videoUrl } = await this.client.apis.lol.fetchSkin(skin, this.client)
      const { embedColor, authorString, authorImage, authorURL} = this.parentCommand
      embed.setColor(embedColor)
        .setAuthor(t(authorString), authorImage, authorURL)
        .setTitle(`${name}`)
        .setImage(splashUrl)
        .setDescription(t('commands:leagueoflegends.subcommands.skin.description', { videoUrl: videoUrl }))
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.skin.invalidSkin'))
    }
  }
}
