const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = []
  }

  async run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)

    if (args.length > 0) {
      if (message.member.voiceChannel) {
        const playerManager = this.client.playerManager
        const identifier = args.join(' ')
        try {
          const song = await playerManager.play(message.member.voiceChannel, message.author, identifier)
          embed
            .setTitle(`${Constants.PLAY_BUTTON} ${song.info.title}`)
            .setURL(song.info.uri)
        } catch(e) {
          embed
            .setColor(Constants.ERROR_COLOR)
            .setTitle('An error occured!')
            .setDescription(e)
        }
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle('You need to be in a voice channel to use this command.')
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('You need to give me a track identifier.')
        .setDescription(`**Usage:** \`${process.env.PREFIX}${this.name} <track name|track url>\``)
    }

    message.channel.send(embed)
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
