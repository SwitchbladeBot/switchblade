const { SwitchbladeEmbed, Constants, Command, CommandError } = require('../../../')

module.exports = class LastfmLoveTrack extends Command {
  constructor (client) {
    super({
      name: 'love',
      aliases: ['l'],
      parent: 'lastfm',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true, envVars: ['DASHBOARD_URL'] }
    }, client)
  }

  async run ({ t, author, channel, guild, prefix }) {
    try {
      channel.startTyping()
      const embed = new SwitchbladeEmbed(author)
      const userConnections = await this.client.controllers.connection.getConnections(author.id)
      const lastfm = userConnections.find(c => c.name === 'lastfm')
      if (!lastfm) {
        throw new CommandError(t('commands:lastfm.subcommands.love.notConnected', { link: `${process.env.DASHBOARD_URL}/profile` }))
      }
      const { playingSong } = this.client.playerManager.get(guild.id)
      const filteredTitle = await this.client.apis.lastfm.loveSong(playingSong, lastfm.tokens.sk)
      channel.send(embed.setAuthor(`${playingSong.author} - ${filteredTitle}`, playingSong.mainImage || Constants.DEFAULT_SONG_PNG)
        .setDescription(t('commands:lastfm.subcommands.love.loved', { unloveCommand: `${prefix}lastfm unlove` })))
        .then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
