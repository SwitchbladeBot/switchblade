const { Command, CommandRequirements } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super(client)
    this.name = 'stop'
    this.aliases = []

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true})
  }

  async run ({ author, guild }, args) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    guildPlayer.stop(author)
  }
}
