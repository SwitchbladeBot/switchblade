const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class Bassboost extends Command {
  constructor (client) {
    super(client)
    this.name = 'bassboost'
    this.aliases = ['bass', 'earrape']
    this.category = 'music'

    this.requirements = new CommandRequirements(this, { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true })
  }

  async run ({ t, author, channel, guild }, volume) {
    const embed = new SwitchbladeEmbed(author)

    const guildPlayer = this.client.playerManager.get(guild.id)
    guildPlayer.bassboost(!guildPlayer.bassboosted)
    channel.send(embed.setTitle(t(`commands:bassboost.bassboost_${guildPlayer.bassboosted}`)))
  }
}
