const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const moment = require('moment')

module.exports = class DBL extends SearchCommand {
  constructor (client) {
    super({
      name: 'dbl',
      aliases: ['discordbotlist'],
      category: 'bot',
      requirements: { apis: ['dbl'] },
      parameters: [{
        type: 'string', full: true, missingError: 'commons:search.noParams'
      }],
      embedColor: Constants.DBL_COLOR,
      embedLogoURL: 'https://i.imgur.com/aSsYKFp.png'
    }, client)

    this.MAIN_URL = 'https://discordbots.org/bot/'
  }

  async search (context, query) {
    return this.client.apis.dbl.searchBots(query, 10)
  }

  searchResultFormatter (obj) {
    return `[${obj.username}#${obj.discriminator}](${this.MAIN_URL + obj.id})`
  }

  async handleResult ({ t, author, channel, language }, bot) {
    channel.startTyping()
    moment.locale(language)
    const data = await this.client.apis.dbl.getBot(bot.clientid)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.DBL_COLOR)
      .setAuthor('Discord Bot List', this.embedLogoURL)
      .setTitle(`${data.username}#${data.discriminator}`)
      .setURL(this.MAIN_URL + data.id)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=2048`)
      .setDescription(data.shortdesc || t('commands:dbl.noDescription'))
      .addField(t('commands:dbl.prefix'), data.prefix, true)
      .addField(t('commands:dbl.library'), data.lib, true)
      .addField(data.owners.length > 1 ? t('commands:dbl.ownerPlural') : t('commands:dbl.owner'), data.owners.map(u => `<@${u}>`).join('\n'), true)
      .addField(t('commands:dbl.acceptedAt'), `${moment(data.date).format('LLL')}\n(${moment(data.date).fromNow()})`, true)
    if (data.server_count) embed.addField(t('commands:dbl.servers'), MiscUtils.formatNumber(data.server_count, language), true)
    if (data.shards.length > 0) embed.addField(t('commands:dbl.shards'), MiscUtils.formatNumber(data.shards.length, language), true)
    if (data.website) embed.addField(t('commands:dbl.website'), t('commands:dbl.clickHere', { link: data.website }), true)
    if (data.support) embed.addField(t('commands:dbl.supportServer'), t('commands:dbl.clickHere', { link: `https://discord.gg/${data.support}` }), true)
    if (data.github) embed.addField(t('commands:dbl.githubRepository'), t('commands:dbl.clickHere', { link: data.github }), true)

    channel.send(embed).then(() => channel.stopTyping())
  }
}
