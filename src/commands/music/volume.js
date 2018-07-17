const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, NumberParameter } = CommandStructures

module.exports = class Volume extends Command {
  constructor (client) {
    super(client)
    this.name = 'volume'
    this.aliases = ['vol']

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true, playerManagerOnly: true})
    this.parameters = new CommandParameters(this,
      new NumberParameter({full: true, missingError: 'commands:volume.missingVolumeParameter', min: 0, max: 150})
    )
  }

  async run ({ t, author, channel, guild }, volume) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)
    guildPlayer.volume(volume)
    channel.send(embed.setTitle(`\uD83D\uDD0A ${t('commands:volume.volumeSet', {volume})}`))
  }
}
