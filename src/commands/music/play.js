const { Command, CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Song, Playlist } = require('../../music/structures')
const { CommandRequirements, CommandParameters, StringParameter } = CommandStructures

module.exports = class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = []

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true})
    this.parameters = new CommandParameters(this, new StringParameter({full: true}))
  }

  async run (message, identifier) {
    const user = message.author
    message.channel.startTyping()
    const playerManager = this.client.playerManager
    try {
      const res = await playerManager.loadTracks(identifier, user) || await playerManager.loadTracks(`ytsearch:${identifier}`, user)
      if (res) {
        this.loadSongs(message, res, playerManager).then(() => message.channel.stopTyping())
      } else {
        message.channel.send(
          new SwitchbladeEmbed(user)
            .setColor(Constants.ERROR_COLOR)
            .setTitle('Sorry, I couldn\'t find this song!')
        ).then(() => message.channel.stopTyping())
      }
    } catch (e) {
      message.channel.send(
        new SwitchbladeEmbed(user)
          .setColor(Constants.ERROR_COLOR)
          .setTitle('An error occured!')
          .setDescription(e)
      ).then(() => message.channel.stopTyping())
      message.client.logError(e)
    }
  }

  loadSongs (message, res, playerManager) {
    if (res instanceof Song) {
      this.songFeedback(message, res)
      return playerManager.play(res, message.member.voiceChannel)
    } else if (res instanceof Playlist) {
      this.playlistFeedback(message, res)
      return Promise.all(res.songs.map(song => {
        this.songFeedback(message, song, false)
        return playerManager.play(song, message.member.voiceChannel)
      }))
    }
    return Promise.reject(new Error('Invalid song instance.'))
  }

  playlistFeedback (message, playlist, playingNow) {
    const duration = ` \`(${playlist.formattedDuration})\``
    const amount = playlist.songs.length
    message.channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(playlist.artwork)
        .setDescription(`${Constants.PLAY_BUTTON} **${amount} songs from playlist** [${playlist.title}](${playlist.uri})${duration} **has been added to queue!**`)
    )
  }

  songFeedback (message, song, queueFeedback = true, startFeedback = true) {
    const bEmbed = (t, u) => new SwitchbladeEmbed(u).setDescription(t)
    const send = (t, u) => message.channel.send(bEmbed(t, u))
    const sendWI = (t, i, u) => message.channel.send(bEmbed(t, u).setThumbnail(i || song.artwork))

    const duration = song.isStream ? '' : ` \`(${song.formattedDuration})\``

    song.once('end', () => send(`${Constants.STOP_BUTTON} [${song.title}](${song.uri}) **has ended!**`))
    song.once('stop', u => send(`${Constants.STOP_BUTTON} **The queue is now empty, leaving the voice channel!**`, u))

    if (startFeedback) {
      song.once('start', () => sendWI(`${Constants.PLAY_BUTTON} **Started playing** [${song.title}](${song.uri})${duration}`))
    }

    if (queueFeedback) {
      song.once('queue', () => sendWI(`${Constants.PLAY_BUTTON} [${song.title}](${song.uri})${duration} **has been added to queue!**`))
    }
  }
}
