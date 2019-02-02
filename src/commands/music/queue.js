const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandError, CommandRequirements, CommandParameters, NumberParameter } = CommandStructures

const MAX_PLAYLIST_LENGTH = 10

module.exports = class Queue extends Command {
  constructor (client) {
    super(client)
    this.name = 'queue'
    this.aliases = ['playlist']
    this.category = 'music'

    this.subcommands = [
      new QueueClear(client, this),
      new QueueJump(client, this),
      new QueueRemove(client, this),
      new QueueShuffle(client, this)
    ]

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

class QueueShuffle extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'shuffle'
    this.aliases = ['sf']
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

class QueueRemove extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'remove'
    this.aliases = ['rm']

    this.parameters = new CommandParameters(this,
      new NumberParameter({ full: true, missingError: `commands:${this.tPath}.missingIndexParameter`, min: 1 })
    )
  }

  async run ({ t, author, channel, guild }, index) {
    const guildPlayer = this.client.playerManager.get(guild.id)
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

class QueueJump extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'jump'
    this.aliases = ['jumpto', 'skipto']

    this.parameters = new CommandParameters(this,
      new NumberParameter({ full: true, missingError: `commands:${this.tPath}.missingIndexParameter`, min: 1 })
    )
  }

  async run ({ t, author, channel, guild }, index) {
    const guildPlayer = this.client.playerManager.get(guild.id)
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
