const { Command, CommandRequirements, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'pause'
    this.aliases = ['resume']

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true, playerManagerOnly: true})
  }

  async run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)
    const pause = !guildPlayer.paused
    embed.setTitle(`${pause ? Constants.PAUSE_BUTTON : Constants.PLAY_BUTTON} ${t('music:stateChanged', {context: pause ? 'pause' : 'resume'})}`)
    channel.send(embed).then(() => guildPlayer.pause(pause))
  }
}
