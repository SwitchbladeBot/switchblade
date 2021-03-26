const { SwitchbladeEmbed, Constants, Command, CommandError } = require('../../../')

const TYPES = ['tracks', 'artists', 'albums']
const PERIODS = ['overall', '7day', '1month', '3month', '6month', '12month']

module.exports = class LastfmUserTop extends Command {
  constructor (client) {
    super({
      name: 'top',
      parent: 'lastfm',
      parameters: [{
        type: 'string', missingError: 'commands:lastfm.subcommands.top.missingUser'
      }, {
        type: 'string', missingError: 'commands:lastfm.subcommands.top.missingType'
      }, {
        type: 'string', required: false
      }]
    }, client)
  }

  async run ({ t, author, channel, guild, language }, user, type, period = '1month') {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)

    if (!TYPES.includes(type)) {
      throw new CommandError(t('commands:lastfm.subcommands.top.missingType'))
    }
    if (!PERIODS.includes(period)) {
      throw new CommandError(t('commands:lastfm.subcommands.top.invalidPeriod'))
    }

    try {
      const res = await this.client.apis.lastfm.getUserTop(user, type, period, 10)

      const res1 = res.topalbums || res.topartists || res.toptracks
      const top = this.formatTopList(t, res1)
      const title = t('commands:lastfm.subcommands.top.title', {
        user,
        top: t('commands:lastfm.subcommands.top.top.' + type),
        period: t('commands:lastfm.subcommands.top.period.' + period)
      })

      embed.setAuthor(title, 'https://i.imgur.com/TppYCun.png')
        .setColor(Constants.LASTFM_COLOR)

      if (top.length) {
        embed.setDescription(top)
      } else {
        embed.setDescription(t('commands:lastfm.subcommands.top.noData'))
      }

      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:lastfm.subcommands.top.notFound'))
    }
  }

  formatTopList (t, top) {
    const formatNumber = (n) => Number(n) > 9 ? n : '0' + n
    const type = Object.keys(top).filter(a => a !== '@attr')[0]
    if (type === 'album') {
      return top.album.map(album => `\`${formatNumber(album['@attr'].rank)}.\` [${album.name}](${album.url}) ${album.artist.name} - ${t('commands:lastfm.playcountCount', { times: album.playcount })}`)
    } else if (type === 'artist') {
      return top.artist.map(artist => `\`${formatNumber(artist['@attr'].rank)}.\` [${artist.name}](${artist.url}) - ${t('commands:lastfm.playcountCount', { times: artist.playcount })}`)
    } else {
      return top.track.map(track => `\`${formatNumber(track['@attr'].rank)}.\` [${track.name}](${this.parentCommand.formatUrl(track.url)}) ${track.artist.name} - ${t('commands:lastfm.playcountCount', { times: track.playcount })}`)
    }
  }
}
