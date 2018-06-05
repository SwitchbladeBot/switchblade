const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Skip extends Command {
  constructor (client) {
    super(client)
    this.name = 'next'
    this.aliases = ['skip']
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        /*if (message.member.hasPermission('MANAGE_GUILD')) {
          return this.skip(message, guildPlayer)
        }*/

        const requiredVotes = Math.floor(guildPlayer.voiceChannel.members.size / 2)
        const skipVotes = guildPlayer.skipVotes
        const id = message.author.id
        if (skipVotes.includes(id)) skipVotes.splice(skipVotes.indexOf(id), 1)
        else                        skipVotes.push(id)

        const voteInfo = `${Math.min(skipVotes.length, requiredVotes)}/${requiredVotes}`
        if (skipVotes.length >= requiredVotes) {
          message.channel.send(embed
            .setTitle('Skipvote has ended. ' + voteInfo)
          )
          this.skip(message, guildPlayer)
        } else {
          if (skipVotes.includes(id)) {
            message.channel.send(embed
              .setTitle('You\'ve voted for skip. ' + voteInfo)
            )
          } else {
            message.channel.send(embed
              .setTitle('You\'ve removed your skip vote.' + voteInfo)
            )
          }
        }
      } else {
        message.channel.send(embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle('I ain\'t playing anything!'))
      }
    } else {
      message.channel.send(embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('You need to be in a voice channel to use this command!'))
    }
  }

  skip (message, guildPlayer) {
    const song = guildPlayer.playingSong
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setDescription(`${Constants.STOP_BUTTON} [${song.title}](${song.uri}) **was skipped!**`)
    )
    guildPlayer.next()
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
