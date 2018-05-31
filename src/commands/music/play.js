const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = []
  }

  async run (message, args) {
    if (args.length > 0) {
      if (message.member.voiceChannel) {
        const playerManager = this.client.playerManager
        try {
          const song = await playerManager.fetchSong(args.join(' '), message.author)
          if (song) {
            this.songFeedback(message, song)
            await playerManager.play(message.member.voiceChannel, song)
          } else {
            message.channel.send(
              new SwitchbladeEmbed(message.author)
                .setColor(Constants.ERROR_COLOR)
                .setTitle('Sorry, I couldn\'t find this song!')
            )
          }
        } catch (e) {
          message.channel.send(
            new SwitchbladeEmbed(message.author)
              .setColor(Constants.ERROR_COLOR)
              .setTitle('An error occured!')
              .setDescription(e)
          )
          console.error(e)
        }
      } else {
        message.channel.send(
          new SwitchbladeEmbed(message.author)
            .setColor(Constants.ERROR_COLOR)
            .setTitle('You need to be in a voice channel to use this command.')
        )
      }
    } else {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setColor(Constants.ERROR_COLOR)
          .setTitle('You need to give me a track identifier.')
          .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <track name|track url>\``)
      )
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
          .setDescription(`${Constants.PLAY_BUTTON} [${song.info.title}](${song.info.uri}) ** was added to queue!**`)
      )
    })

    song.once('end', () => {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setDescription(`${Constants.PLAY_BUTTON} [${song.info.title}](${song.info.uri}) **has ended!**`)
      )
    })

    song.once('stop', user => {
      message.channel.send(
        new SwitchbladeEmbed(user)
          .setDescription(`${Constants.STOP_BUTTON} **All tracks have been stopped, leaving voice channel now!**`)
      )
    })
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
