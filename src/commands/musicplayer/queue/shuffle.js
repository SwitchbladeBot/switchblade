const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class QueueShuffle extends Command {
  constructor (client) {
    super({
      name: 'shuffle',
      aliases: ['sf'],
      parent: 'queue'
    }, client)
  }

  async run ({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    if (guildPlayer.nextSong) {
      guildPlayer.shuffleQueue()
      channel.send(new SwitchbladeEmbed(author)
        .setTitle(t(`commands:${this.tPath}.queueShuffled`)))
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}
