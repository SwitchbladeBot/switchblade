const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, NumberParameter } = CommandStructures

const MAX_VOLUME = 150

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
    if (guildPlayer.bassboosted) {
      guildPlayer.bassboost(false)
      channel.send(embed
        .setTitle(`\uD83D\uDD08 MUTE THE BASS \uD83D\uDD08`))
    } else {
      guildPlayer.bassboost()
      channel.send(embed
        .setTitle(`\uD83D\uDD0A DROP THE BASS \uD83D\uDD0A`)
        .setImage('https://i.imgur.com/A6HWTqq.png'))
    }
  }
}
