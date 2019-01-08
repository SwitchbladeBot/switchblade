const { Command, CommandRequirements, SwitchbladeEmbed } = require('../../')

const MAX_PLAYLIST_LENGTH = 10

module.exports = class Queue extends Command {
  constructor (client) {
    super(client)
    this.name = 'queue'
    this.aliases = ['playlist']
    this.category = 'music'

    this.subcommands = [ new QueueClear(client, this), new QueueShuffle(client, this) ]
    this.requirements = new CommandRequirements(this, { guildOnly: true, guildPlaying: true })
  }

  async run ({ t, aliase, author, channel, guild, prefix }) {
    const { playingSong, queue } = this.client.playerManager.get(guild.id)
    const embed = new SwitchbladeEmbed(author)

    const npSong = playingSong
    const description = [`**${t('music:nowPlaying')}** [${npSong.title}](${npSong.uri})`]

    if (queue.length > 0) {
      const queueParsed = queue.slice(0, MAX_PLAYLIST_LENGTH).map((song, i) => `${i + 1}. [${song.title}](${song.uri}) *(${t('music:addedBy', { user: song.requestedBy })})*`)
      description.push('', `**${t('music:queue')}:**`, ...queueParsed)

      const missing = queue.length - MAX_PLAYLIST_LENGTH
      if (missing > 0) description.push(`\`${t('music:andMore', { missing })}\``)

      description.push('', t('commands:queue.clearAdvice', { usage: `${prefix}${aliase} clear` }))
    } else {
      description.push(t('music:noneAfterCurrent'))
    }

    channel.send(embed.setDescription(description.join('\n')))
  }
}

class QueueClear extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'clear'
    this.aliases = ['cl']
  }

  async run ({ t, author, channel, guild }) {
    const { queue } = this.client.playerManager.get(guild.id)
    const embed = new SwitchbladeEmbed(author)

    if (queue.length > 0) {
      queue.splice(0, queue.length)
      embed.setTitle(t(`commands:${this.tPath}.queueCleared`))
    } else {
      embed.setTitle(t('music:noneAfterCurrent'))
    }

    channel.send(embed)
  }
}

class QueueShuffle extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'shuffle'
    this.aliases = ['sf']
  }

  async run ({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    const embed = new SwitchbladeEmbed(author)

    if (guildPlayer.queue.length > 0) {
      guildPlayer.queue = guildPlayer.queue.sort(() => Math.random() > 0.5 ? -1 : 1)
      embed.setTitle(t(`commands:${this.tPath}.queueShuffled`))
    } else {
      embed.setTitle(t('music:noneAfterCurrent'))
    }

    channel.send(embed)
  }
}

