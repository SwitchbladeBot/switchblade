const { CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter } = CommandStructures
const { Song, Playlist } = require('../../music/structures')

module.exports = class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = []
    this.category = 'music'

    this.requirements = new CommandRequirements(this, {
      guildOnly: true,
      sameVoiceChannelOnly: true,
      voiceChannelOnly: true,
      playerManagerOnly: true
    })

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:play.noTrackIdentifier' })
    )
  }

  async run ({ t, author, channel, guild, voiceChannel }, identifier) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    if (!voiceChannel.joinable) {
      return channel.send(embed.setTitle(t('errors:voiceChannelJoin')))
    }

    const playerManager = this.client.playerManager
    try {
      let { result, tryAgain } = await playerManager.loadTracks(identifier, author)
      if (tryAgain && !result) {
        result = (await playerManager.loadTracks(`ytsearch:${identifier}`, author)).result
      }

      if (result) {
        this.loadSongs({ t, channel, voiceChannel }, result, playerManager).then(() => channel.stopTyping())
      } else {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('music:songNotFound'))
        channel.send(embed).then(() => channel.stopTyping())
      }
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
        .setDescription(e)
      channel.send(embed).then(() => {
        channel.stopTyping()
        this.client.logError(e)
      })
    }
  }

  loadSongs ({ t, channel, voiceChannel }, res, playerManager) {
    if (res instanceof Song) {
      this.songFeedback({ t, channel }, res, true, true)
      return playerManager.play(res, voiceChannel)
    } else if (res instanceof Playlist) {
      this.playlistFeedback({ t, channel }, res, t)
      return Promise.all(res.songs.map(song => {
        this.songFeedback({ t, channel }, song, false, true)
        return playerManager.play(song, voiceChannel)
      }))
    }
    return Promise.reject(new Error('Invalid song instance.'))
  }

  playlistFeedback ({ t, channel }, playlist) {
    const duration = `\`(${playlist.formattedDuration})\``
    const count = playlist.songs.length
    const playlistName = `[${playlist.title}](${playlist.uri})`
    channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(playlist.artwork)
        .setDescription(`${Constants.PLAY_BUTTON} ${t('music:addedFromPlaylist', { count, playlistName, duration })}`)
    )
  }

  songFeedback ({ t, channel }, song, queueFeedback = true, startFeedback = true) {
    const bEmbed = (d, u) => new SwitchbladeEmbed(u).setDescription(d)
    const send = (d, u) => channel.send(bEmbed(d, u))
    const sendWI = (d, i, u) => channel.send(bEmbed(d, u).setThumbnail(i || song.artwork))

    const duration = song.isStream ? `(${t('music:live')})` : `\`(${song.formattedDuration})\``
    const songName = `[${song.title}](${song.uri}) ${duration}`

    song.on('end', () => send(`${Constants.STOP_BUTTON} ${t('music:hasEnded', { songName })}`))
    song.once('stop', u => send(`${Constants.STOP_BUTTON} ${t('music:queueIsEmpty')}`, u))

    if (startFeedback) {
      song.on('start', () => sendWI(`${Constants.PLAY_BUTTON} ${t('music:startedPlaying', { songName })}`))
    }

    if (queueFeedback) {
      song.once('queue', () => sendWI(`${Constants.PLAY_BUTTON} ${t('music:addedToTheQueue', { songName })}`))
    }
  }
}
