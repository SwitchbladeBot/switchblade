const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')
const { Command, CommandParameters, StringParameter, CommandRequirements, CommandError } = CommandStructures
const moment = require('moment')

module.exports = class DBL extends Command {
  constructor (client) {
    super(client)

    this.name = 'dbl'
    this.aliases = ['discordbotlist']
    this.requirements = new CommandRequirements(this, { apis: ['dbl'] })

    this.DBL_LOGO = 'https://i.imgur.com/aSsYKFp.png'
    this.MAIN_URL = 'https://discordbots.org/bot/'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:dbl.noBotName' })
    )
  }

  async run ({ t, author, channel, message, language }, query) {
    channel.startTyping()

    const results = await this.searchHandler(query)
    if (results.ids.length === 0) throw new CommandError(t('commands:dbl.botNotFound'))

    const { description, ids } = results

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.DBL_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:dbl.results', { query }), this.DBL_LOGO)
      .setTitle(t('commands:dbl.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.awaitResponseMessage(message, ids, bot => this.getBot(t, author, channel, language, bot))
  }

  async getBot (t, author, channel, language, bot) {
    channel.startTyping()
    moment.locale(language)
    const data = await this.client.apis.dbl.getBot(bot)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.DBL_COLOR)
      .setAuthor('Discord Bot List', this.DBL_LOGO)
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

  formatIndex (index) {
    return index.toString().padStart(2, '0')
  }

  async searchHandler (query, prefix) {
    if (!prefix) prefix = (obj, i) => `\`${this.formatIndex(++i)}\`. [${obj.username}#${obj.discriminator}](${this.MAIN_URL + obj.id})`

    const results = await this.client.apis.dbl.searchBot(query, 10)
    return results ? { description: results.map(prefix), ids: results.map(r => r.id) } : false
  }

  verifyCollected (selected, length) {
    const number = Math.round(Number(selected))
    if (isNaN(number)) return false
    if (number < 1) return false
    return number <= length
  }

  async awaitResponseMessage (message, ids, callback) {
    const filter = c => c.author.equals(message.author) && this.verifyCollected(c.content, ids.length)

    message.channel.awaitMessages(filter, { time: 10000, max: 1 })
      .then(collected => {
        if (collected.size > 0) callback(ids[Math.round(Number(collected.first().content)) - 1])
      })
  }
}
