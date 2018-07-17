const { Command, CommandRequirements, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Skip extends Command {
  constructor (client) {
    super(client)
    this.name = 'next'
    this.aliases = ['skip']

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true, playerManagerOnly: true})
  }

  async run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)
    const song = guildPlayer.playingSong
    const songName = `[${song.title}](${song.uri})`
    channel.send(embed.setDescription(`${Constants.STOP_BUTTON} ${t('music:wasSkipped', {songName})}`)).then(() => guildPlayer.next())
  }
}
