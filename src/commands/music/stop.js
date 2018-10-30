const { Command, CommandRequirements, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super(client)
    this.name = 'stop'
    this.category = 'music'

    this.requirements = new CommandRequirements(this, { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true, permissions: ['MANAGE_GUILD'] })
  }

  async run ({ author, channel, guild, t }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)
    guildPlayer.stop(author)
    embed.setDescription(`${Constants.STOP_BUTTON} ${t('commands:stop.stopped')}`)
    channel.send(embed)
  }
}
