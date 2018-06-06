const { Command, CommandRequirements } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super(client)
    this.name = 'stop'
    this.aliases = []

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true})
  }

  async run (message, args) {
    const guildPlayer = this.client.playerManager.get(message.guild.id)
    guildPlayer.stop(message.author)
  }
}
