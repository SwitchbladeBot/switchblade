const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Loop extends Command {
  constructor (client) {
    super({
      name: 'loop',
      aliases: ['repeat'],
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true }
    }, client)
  }

  async run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    const loop = !guildPlayer.looping
    embed.setTitle(t('music:stateChanged_loop', { context: loop ? 'on' : 'off' }))
    channel.send(embed).then(() => guildPlayer.loop(loop))
  }
}
