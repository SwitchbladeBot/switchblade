const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class QueueJump extends Command {
  constructor (client) {
    super({
      name: 'jump',
      aliases: ['jumpto', 'skipto'],
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
        const song = guildPlayer.jumpToIndex(Math.round(index) - 1)
        const duration = song.isStream ? `(${t('music:live')})` : `\`(${song.formattedDuration})\``
        const songName = `[${song.title}](${song.uri}) ${duration}`
        channel.send(new SwitchbladeEmbed(author)
          .setDescription(t(`commands:${this.tPath}.jumpedToSong`, { songName })))
      } catch (e) {
        throw new CommandError(t(`commands:${this.tPath}.missingIndexParameter`))
      }
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}
