const { Command, CommandError, Parameter, SwitchbladeEmbed } = require('../../')
const moment = require('moment')

module.exports = class Seek extends Command {
  constructor (client) {
    super({
      name: 'seek',
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true },
      parameters: [{
        type: TargetParameter, full: true, missingError: 'commands:seek.missingSeekParameter'
      }]
    }, client)
  }

  async run ({ t, author, channel, guild }, target) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.players.get(guild.id)

    const { playingSong } = guildPlayer
    if (playingSong.isStream) throw new CommandError(t('commands:seek.notLive'))

    const position = guildPlayer.state.position + target
    if (position > Math.round(playingSong.length / 1000) * 1000) throw new CommandError(t('commands:seek.lengthExceeded'))
    if (position < 0) throw new CommandError(t('commands:seek.noNegativeValues'))

    guildPlayer.seek(position)
    const formattedPosition = moment.duration(position).format('hh:mm:ss', { stopTrim: 'm' })
    channel.send(embed.setTitle(t('commands:seek.positionSet', { position: formattedPosition })))
  }
}

const TIMESTAMP_REGEX = /^(\d+):(\d+)(?::(\d+))?$/
const FORWARD_REGEX = /^\+(\d+)$/
const BACKWARD_REGEX = /^-(\d+)$/
class TargetParameter extends Parameter {
  static parse (arg, { client, guild }) {
    if (TIMESTAMP_REGEX.test(arg)) {
      const [, f, s, t] = TIMESTAMP_REGEX.exec(arg)
      const { state: { position } } = client.playerManager.players.get(guild.id)
      const target = moment.duration(t ? `${f}:${s}:${t}` : `00:${f}:${s}`).asMilliseconds()
      return target - position
    } else if (FORWARD_REGEX.test(arg)) {
      const [, t] = FORWARD_REGEX.exec(arg)
      return parseInt(t) * 1000
    } else if (BACKWARD_REGEX.test(arg)) {
      const [, t] = BACKWARD_REGEX.exec(arg)
      return -parseInt(t) * 1000
    }
  }
}
