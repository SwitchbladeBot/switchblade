const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

module.exports = class QueueShuffle extends Command {
  constructor (client) {
    super(client, {
      name: 'shuffle',
      aliases: ['sf'],
      parentCommand: 'queue'
    })
  }

  async run ({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    if (guildPlayer.nextSong) {
      guildPlayer.shuffleQueue()
      channel.send(new SwitchbladeEmbed(author)
        .setTitle(t(`commands:${this.tPath}.queueShuffled`)))
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}
