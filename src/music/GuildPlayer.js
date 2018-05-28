const { Player } = require('discord.js-lavalink')

module.exports = class GuildPlayer extends Player {
  constructor (options = {}) {
    super(options)

    this.on('end', (data) => {
      if (data.reason === 'REPLACED') return
      this.playingSong = null
      console.log(data)
    })

    this.on('error', console.error)
  }

  play (song, options = {}) {
    super.play(song.track, options)
    this.playingSong = song
    this.volume(5)
  }
}
