const { Command, SwitchbladeEmbed, Constants } = require('../../')
const { Song, Playlist } = require('../../music/structures')

module.exports = class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = []
  }

  async run (message, args, t) {
    const user = message.author
    message.channel.startTyping()
    if (args.length > 0) {
      if (message.member.voiceChannel) {
        const playerManager = this.client.playerManager
        try {
          const identifier = args.join(' ')
          const res = await playerManager.loadTracks(identifier, user) || await playerManager.loadTracks(`ytsearch:${identifier}`, user)
          if (res) {
            await this.loadSongs(message, res, playerManager, t)
            message.channel.stopTyping()
          } else {
            message.channel.send(
              new SwitchbladeEmbed(user)
                .setColor(Constants.ERROR_COLOR)
                .setTitle(t('music:songNotfound'))
            ).then(() => message.channel.stopTyping())
          }
        } catch (e) {
          message.channel.send(
            new SwitchbladeEmbed(user)
              .setColor(Constants.ERROR_COLOR)
              .setTitle(t('errors:generic'))
              .setDescription(e)
          ).then(() => message.channel.stopTyping())
          message.client.logError(e)
        }
      } else {
        message.channel.send(
          new SwitchbladeEmbed(user)
            .setColor(Constants.ERROR_COLOR)
            .setTitle(t('errors:voiceChannelOnly'))
        ).then(() => message.channel.stopTyping())
      }
    } else {
      message.channel.send(
        new SwitchbladeEmbed(user)
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:play.noTrackIdentifier'))
          .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:play.commandUsage')}`)
      ).then(() => message.channel.stopTyping())
    }
  }

  loadSongs (message, res, playerManager, t) {
    if (res instanceof Song) {
      this.songFeedback(message, res, true, true, t)
      return playerManager.play(res, message.member.voiceChannel)
    } else if (res instanceof Playlist) {
      this.playlistFeedback(message, res, t)
      return Promise.all(res.songs.map(song => {
        this.songFeedback(message, song, false, false, t)
        return playerManager.play(song, message.member.voiceChannel)
      }))
    }
    return Promise.reject(new Error('Invalid song instance.'))
  }

  playlistFeedback (message, playlist, t) {
    const duration = `\`(${playlist.formattedDuration})\``
    const count = playlist.songs.length
    const playlistName = `[${playlist.title}](${playlist.uri})`
    message.channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(playlist.artwork)
        .setDescription(`${Constants.PLAY_BUTTON} ${t('music:addedFromPlaylist', {count, playlistName, duration})}`)
    )
  }

  songFeedback (message, song, queueFeedback = true, startFeedback = true, t) {
    const bEmbed = (d, u) => new SwitchbladeEmbed(u).setDescription(d)
    const send = (d, u) => message.channel.send(bEmbed(d, u))
    const sendWI = (d, i, u) => message.channel.send(bEmbed(d, u).setThumbnail(i || song.artwork))

    const duration = song.isStream ? `(${t('music:live')})` : `\`(${song.formattedDuration})\``
    const songName = `[${song.title}](${song.uri}) ${duration}`

    song.once('end', () => send(`${Constants.STOP_BUTTON} ${t('music:hasEnded', {songName})}`))
    song.once('stop', u => send(`${Constants.STOP_BUTTON} ${t('music:queueIsEmpty')}`, u))

    if (startFeedback) {
      song.once('start', () => sendWI(`${Constants.PLAY_BUTTON} ${t('music:startedPlaying', {songName})}`))
    }

    if (queueFeedback) {
      song.once('queue', () => sendWI(`${Constants.PLAY_BUTTON} ${t('music:addedToTheQueue', {songName})}`))
    }
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
