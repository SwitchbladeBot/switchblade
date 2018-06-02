const { Command, SwitchbladeEmbed, Constants } = require('../../')
const { Song, Playlist } = require('../../music/structures')

module.exports = class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = []
  }

  async run (message, args) {
    const user = message.author
    message.channel.startTyping()
    if (args.length > 0) {
      if (message.member.voiceChannel) {
        const playerManager = this.client.playerManager
        try {
          const identifier = args.join(' ')
          const res = await playerManager.loadTracks(identifier, user) || await playerManager.loadTracks(`ytsearch:${identifier}`, user)
          if (res) {
            await this.loadSongs(message, res, playerManager)
            message.channel.stopTyping()
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
      } else {
        message.channel.send(
          new SwitchbladeEmbed(user)
            .setColor(Constants.ERROR_COLOR)
            .setTitle('You need to be in a voice channel to use this command!')
        ).then(() => message.channel.stopTyping())
      }
    } else {
      message.channel.send(
        new SwitchbladeEmbed(user)
          .setColor(Constants.ERROR_COLOR)
          .setTitle('You need to give me a track identifier!')
          .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <track name|track url>\``)
      ).then(() => message.channel.stopTyping())
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
        .setDescription(`${Constants.PLAY_BUTTON} **${amount} songs from playlist** [${playlist.title}](${playlist.uri})${duration} **was added to queue!**`)
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
      song.once('queue', () => sendWI(`${Constants.PLAY_BUTTON} [${song.title}](${song.uri})${duration} **was added to queue!**`))
    }
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
