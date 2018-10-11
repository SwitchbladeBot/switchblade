const { Command, CommandRequirements } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super(client)
    this.name = 'stop'
    this.category = 'music'

    this.requirements = new CommandRequirements(this, { guildOnly: true, voiceChannelOnly: true, guildPlaying: true, playerManagerOnly: true })
  }

  async run ({ author, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    guildPlayer.stop(author)
  }
}
