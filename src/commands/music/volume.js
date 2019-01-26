const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, NumberParameter } = CommandStructures

const MAX_VOLUME = 150

module.exports = class Volume extends Command {
  constructor (client) {
    super(client)
    this.name = 'volume'
    this.aliases = ['vol']
    this.category = 'music'

    this.requirements = new CommandRequirements(this, { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true, errors: { guildPlaying: 'commands:volume.notPlaying' } })
    this.parameters = new CommandParameters(this,
      new NumberParameter({ full: true, missingError: 'commands:volume.missingVolumeParameter', min: 0, max: MAX_VOLUME })
    )
  }

  async run ({ t, author, channel, guild }, volume) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)

    if (volume === MAX_VOLUME) embed.setImage('https://i.imgur.com/A6HWTqq.png')
    else if (guildPlayer.bassboosted) guildPlayer.bassboost(false)

    guildPlayer.volume(volume)

    channel.send(embed.setTitle(`\uD83D\uDD0A ${t('commands:volume.volumeSet', { volume })}`))
  }
}
