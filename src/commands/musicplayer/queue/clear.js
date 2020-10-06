const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class QueueClear extends Command {
  constructor (client) {
    super({
      name: 'clear',
      aliases: ['cl'],
      parent: 'queue'
    }, client)
  }

  async run ({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    if (guildPlayer.nextSong) {
      guildPlayer.clearQueue()
      channel.send(new SwitchbladeEmbed(author)
        .setTitle(t(`commands:${this.tPath}.queueCleared`)))
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}
