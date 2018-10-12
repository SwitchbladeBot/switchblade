const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Deezer extends Command {
  constructor (client) {
    super(client)

    this.name = 'deezer'
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:deezer.noTrackName' })
    )
  }

  async run ({ t, author, channel }, trackName) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const track = await this.client.apis.deezer.findTracks(trackName)
    if (track.total > 0) {
      const [ info ] = track.data
      embed.setColor(Constants.DEEZER_COLOR)
        .setAuthor('Deezer', 'https://i.imgur.com/lKlFtbs.png')
        .setThumbnail(info.album.cover_big)
        .setDescription(`[**${info.title}**](${info.link})\n${info.artist.name}`)
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:deezer.noTracksFound'))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
