const { Command, CommandRequirements, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Skip extends Command {
  constructor (client) {
    super(client)
    this.name = 'next'
    this.aliases = ['skip']

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true})
  }

  async run (message, args) {
    const guildPlayer = this.client.playerManager.get(message.guild.id)
    const song = guildPlayer.playingSong
    message.channel.send(new SwitchbladeEmbed(message.author)
      .setDescription(`${Constants.STOP_BUTTON} [${song.title}](${song.uri}) **was skipped!**`))
    guildPlayer.next()
  }
}
