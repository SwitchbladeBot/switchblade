const { Command, CommandRequirements, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Skip extends Command {
  constructor (client) {
    super(client)
    this.name = 'next'
    this.aliases = ['skip']

    this.requirements = new CommandRequirements(this, {guildOnly: true, voiceChannelOnly: true, guildPlaying: true})
  }

  async run ({ t, author, channel, guild }, args) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    const song = guildPlayer.playingSong
    const songName = `[${song.title}](${song.uri})`
    channel.send(new SwitchbladeEmbed(author)
      .setDescription(`${Constants.STOP_BUTTON} ${t('music:wasSkipped', {songName})}`))
    guildPlayer.next()
  }
}
