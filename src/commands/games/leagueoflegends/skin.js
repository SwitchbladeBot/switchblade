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
      const split = skin.split('|')

      const skinInfo = await this.client.apis.lol.fetchSkin(split[0], split[1], language, this.client)
      embed.setColor(this.parentCommand.embedColor)
        .setAuthor(t(this.parentCommand.authorString), this.parentCommand.authorImage, this.parentCommand.authorURL)
        .setTitle(`${skinInfo.name}`)
        .setImage(skinInfo.splashUrl)
        .setDescription(t('commands:leagueoflegends.subcommands.skin.description', { videoUrl: skinInfo.videoUrl }))
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.skin.invalidSkin'))
    }
  }
}
