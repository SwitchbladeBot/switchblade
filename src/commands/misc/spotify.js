const { Command, SwitchbladeEmbed } = require('../../')

const spotifyBaseUrl = 'https://api.spotify.com/v1/'

module.exports = class Spotify extends Command {
  constructor (client) {
    super(client)

    this.name = 'spotify'
  }

  async run (message, args) {
    if (args.length > 0) {
      message.channel.startTyping()

      const spotify = this.client.apis.spotify

      let query = encodeURI(args.join(' '))

      // Request the track information
      const tracksResponse = await spotify.search({type: 'track', query: query})
      if (tracksResponse.tracks.total > 0) {
        let track = tracksResponse.tracks.items[0]
        let artists = track.artists.map(a => { return a.name }).join(', ')
        const album = await spotify.request(spotifyBaseUrl + 'albums/' + track.album.id)
        let coverUrl = album.images[2].url
        message.channel.send(
          new SwitchbladeEmbed()
            .setAuthor('Spotify', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2000px-Spotify_logo_without_text.svg.png')
            .setThumbnail(coverUrl)
            .setDescription(`[**${track.name}**](${track.external_urls.spotify}) (${msToMMSS(track.duration_ms)})\n${artists}`)
            .setColor(this.client.colors.spotify)
        ).then(() => message.channel.stopTyping())
      } else {
        message.channel.send(
          new SwitchbladeEmbed(message.author)
            .setColor(this.client.colors.error)
            .setTitle('I couldn\'t find any tracks with that name.')
        ).then(() => message.channel.stopTyping())
      }
    } else {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setColor(this.client.colors.error)
          .setTitle('You need to give me a track name.')
          .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <track name>\``)
      ).then(() => message.channel.stopTyping())
    }
  }
}

function msToMMSS (millis) {
  let minutes = Math.floor(millis / 60000)
  let seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
