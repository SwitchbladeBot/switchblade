const { Command, CommandRequirements, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'loop'
    this.aliases = ['repeat']
    this.category = 'music'

    this.requirements = new CommandRequirements(this, { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true, playerManagerOnly: true })
  }

  async run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)
    const loop = !guildPlayer.looping
    embed.setTitle(t('music:stateChanged_loop', { context: loop ? 'on' : 'off' }))
    channel.send(embed).then(() => guildPlayer.loop(loop))
  }
}
