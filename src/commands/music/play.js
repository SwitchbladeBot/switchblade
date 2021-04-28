const { Command, CommandError, Constants, SwitchbladeEmbed } = require('../../')
const { Song, Playlist } = require('../../music/structures')

module.exports = class Play extends Command {
  constructor (client) {
    super({
      name: 'play',
      aliases: ['p'],
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, voiceChannelOnly: true, playerManagerOnly: true },
      parameters: [{
        type: 'string', full: true, missingError: 'commands:play.noTrackIdentifier'
      }, [{
        type: 'booleanFlag', name: 'soundcloud', aliases: ['sc']
      }, {
        type: 'booleanFlag', name: 'youtube', aliases: ['yt']
      }]]
    }, client)
  }

  async run ({ t, author, channel, flags, guild, voiceState }, identifier) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    if (!voiceState.channel.joinable && guild.me.voice.channelID !== voiceState.channelID) {
      return channel.send(embed.setTitle(t('errors:voiceChannelJoin')))
    }

    identifier = identifier.replace(/<?>?/g, '')
    const playerManager = this.client.playerManager
    try {
      const specificSearch = flags.soundcloud || flags.youtube
      if (flags.soundcloud) identifier = `scsearch:${identifier}`
      else if (flags.youtube) identifier = `ytsearch:${identifier}`

      let { result, tryAgain } = await playerManager.loadTracks(identifier, author)
      if (tryAgain && !result && !specificSearch) {
        result = (await playerManager.loadTracks(`ytsearch:${identifier}`, author)).result
      }

      if (result) {
        this.loadSongs({ t, channel, voiceChannel: voiceState.channel }, result, playerManager).then(() => channel.stopTyping())
      } else {
        throw new CommandError(t('music:songNotFound'))
      }
    } catch (e) {
      if (e instanceof CommandError) throw e

      this.client.logError(e)
      channel.send(embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
      ).then(() => channel.stopTyping())
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
        .setDescription(`${this.getEmoji('playButton')} ${t('music:addedFromPlaylist', { count, playlistName, duration })}`)
    )
  }

  songFeedback ({ t, channel }, song, queueFeedback = true, startFeedback = true) {
    const bEmbed = (d, u) => new SwitchbladeEmbed(u).setDescription(d)
    const send = (d, u) => channel.send(bEmbed(d, u))
    const sendWI = (d, i, u) => channel.send(bEmbed(d, u).setThumbnail(i || song.artwork))

    const duration = song.isStream ? `(${t('music:live')})` : `\`(${song.formattedDuration})\``
    const songName = `[${song.title}](${song.uri}) ${duration}`

    song.on('end', () => send(`${this.getEmoji('stopButton')} ${t('music:hasEnded', { songName })}`))
    song.once('stop', u => send(`${this.getEmoji('stopButton')} ${t('music:queueIsEmpty')}`, u))
    song.once('abruptStop', () => send(`${this.getEmoji('stopButton')} ${t('music:leftDueToInactivity')}`))

    if (startFeedback) {
      song.on('start', () => sendWI(`${this.getEmoji('playButton')} ${t('music:startedPlaying', { songName })}`))
    }

    if (queueFeedback) {
      song.once('queue', () => sendWI(`${this.getEmoji('playButton')} ${t('music:addedToTheQueue', { songName })}`))
    }
  }
}
