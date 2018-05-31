const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = []
  }

  async run (message, args) {
    message.channel.startTyping()
    if (args.length > 0) {
      if (message.member.voiceChannel) {
        const playerManager = this.client.playerManager
        try {
          const song = await playerManager.fetchSong(args.join(' '), message.author)
          if (song) {
            this.songFeedback(message, song)
            await playerManager.play(song, message.member.voiceChannel)
            message.channel.stopTyping()
          } else {
            message.channel.send(
              new SwitchbladeEmbed(message.author)
                .setColor(Constants.ERROR_COLOR)
                .setTitle('Sorry, I couldn\'t find this song!')
            ).then(() => message.channel.stopTyping())
          }
        } catch (e) {
          message.channel.send(
            new SwitchbladeEmbed(message.author)
              .setColor(Constants.ERROR_COLOR)
              .setTitle('An error occured!')
              .setDescription(e)
          ).then(() => message.channel.stopTyping())
          console.error(e)
        }
      } else {
        message.channel.send(
          new SwitchbladeEmbed(message.author)
            .setColor(Constants.ERROR_COLOR)
            .setTitle('You need to be in a voice channel to use this command.')
        ).then(() => message.channel.stopTyping())
      }
    } else {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setColor(Constants.ERROR_COLOR)
          .setTitle('You need to give me a track identifier.')
          .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <track name|track url>\``)
      ).then(() => message.channel.stopTyping())
    }
  }

  songFeedback (message, song) {
    song.once('start', () => {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setDescription(`${Constants.PLAY_BUTTON} **Started playing** [${song.info.title}](${song.info.uri})`)
      )
    })

    song.once('queue', () => {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setDescription(`${Constants.PLAY_BUTTON} [${song.info.title}](${song.info.uri}) **was added to queue!**`)
      )
    })

    song.once('end', () => {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setDescription(`${Constants.STOP_BUTTON} [${song.info.title}](${song.info.uri}) **has ended!**`)
      )
    })

    song.once('stop', user => {
      message.channel.send(
        new SwitchbladeEmbed(user)
          .setDescription(`${Constants.STOP_BUTTON} **The queue is now empty, leaving the voice channel!**`)
      )
    })
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
