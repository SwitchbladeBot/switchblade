const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const Deezer = require('deezer-node-api')
const dz = new Deezer()

module.exports = class Deezer extends Command {
  constructor (client) {
    super(client)

    this.name = 'deezer'
    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:spotify.noTrackName'})
    )
  }

  async run ({ t, author, channel }, trackName) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const track = await dz.findTracks(trackName)
    if (track.total !== 0) {
      embed.setColor(Constants.DEEZER_COLOR)
        .setAuthor('Deezer', 'https://i.imgur.com/lKlFtbs.png')
        .setThumbnail(track.data[0].album.cover_big)
        .setDescription(`[**${track.data[0].title}**](${track.data[0].link})\n${track.data[0].artist.name}`)
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:spotify.noTracksFound'))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
