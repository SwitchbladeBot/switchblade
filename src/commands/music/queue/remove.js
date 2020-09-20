const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class QueueRemove extends Command {
  constructor (client) {
    super({
      name: 'remove',
      aliases: ['rm'],
      parent: 'queue',
      parameters: [{
        type: 'number', full: true, min: 1, missingError: ({ t }) => t(`commands:${this.tPath}.missingIndexParameter`)
      }]
    }, client)
  }

  async run ({ t, author, channel, guild }, index) {
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    if (guildPlayer.nextSong) {
      try {
        const song = guildPlayer.removeFromQueue(Math.round(index) - 1)
        const duration = song.isStream ? `(${t('music:live')})` : `\`(${song.formattedDuration})\``
        const songName = `[${song.title}](${song.uri}) ${duration}`
        channel.send(new SwitchbladeEmbed(author)
          .setDescription(t(`commands:${this.tPath}.songRemoved`, { songName }))
          .setThumbnail(song.artwork))
      } catch (e) {
        throw new CommandError(t(`commands:${this.tPath}.missingIndexParameter`))
      }
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}
