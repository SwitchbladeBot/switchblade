const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class QueueClear extends Command {
  constructor (client) {
    super(client, {
      name: 'clear',
      aliases: ['cl'],
      parentCommand: 'queue'
    })
  }

  async run ({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    if (guildPlayer.nextSong) {
      guildPlayer.clearQueue()
      channel.send(new SwitchbladeEmbed(author)
        .setTitle(t(`commands:${this.tPath}.queueCleared`)))
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}
