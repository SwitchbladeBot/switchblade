const SearchCommand = require('../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, CommandStructures, Constants, MiscUtils } = require('../../')
const { CommandRequirements, CommandParameters, StringParameter, BooleanFlagParameter } = CommandStructures
const moment = require('moment')

module.exports = class YouTube extends SearchCommand {
  constructor (client) {
    super(client)

    this.name = 'youtube'
    this.aliases = ['yt']
    this.embedColor = Constants.YOUTUBE_COLOR
    this.embedLogoURL = 'https://i.imgur.com/yQy45qO.png'

    this.requirements = new CommandRequirements(this, { apis: ['youtube'] })
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commons:search.noParams' }),
      [
        new BooleanFlagParameter({ name: 'video', aliases: [ 'v', 'videos' ] }),
        new BooleanFlagParameter({ name: 'channel', aliases: [ 'c', 'channels' ] }),
        new BooleanFlagParameter({ name: 'playlist', aliases: [ 'p', 'playlists' ] }),
        new StringParameter({ name: 'order', aliases: 'o', full: false, required: false, whitelist: ['date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount'] })
      ]
    )
  }

  async search (context, query) {
    const { flags } = context
    const types = Object.keys(flags).filter(f => ['video', 'channel', 'playlist'].includes(f))
    const res = await this.client.apis.youtube.search(query, types, 'snippet,id', flags.order || 'relevance', 10)
    return res.items
  }

  searchResultFormatter ({ id, snippet }) {
    const { title } = snippet
    const type = this.getType(id)
    return `\`${type === 'video' ? 'V' : type === 'channel' ? 'C' : 'P'}\` ${title}`
  }

  async handleResult (ctx, item) {
    const { t, channel } = ctx
    await channel.startTyping()
    const type = this.getType(item.id)
    const embed = await this[`get${MiscUtils.capitalizeFirstLetter(type)}`](ctx, item)
    embed.setAuthor(t(`commands:youtube.${type}.info`), this.embedLogoURL)
      .setColor(this.embedColor)
    channel.send(embed).then(() => channel.stopTyping())
  }

  async getVideo ({ t, author, language }, { id: videoID }) {
    moment.locale(language)
    const { id, snippet, statistics, contentDetails } = await this.client.apis.youtube.getVideo(videoID.videoId, 'snippet,statistics,contentDetails')
    const { publishedAt, channelId, title, thumbnails, channelTitle, tags } = snippet
    const description = `[${title}](https://youtu.be/${id.videoId}) `
    const embed = new SwitchbladeEmbed(author)
      .setDescription(description.size > 2040 ? description.slice(0, 2040) + '...' : description)
      .addField(t('commands:youtube.likes'), MiscUtils.formatNumber(statistics.likeCount, language), true)
      .addField(t('commands:youtube.dislikes'), MiscUtils.formatNumber(statistics.dislikeCount, language), true)
      .addField(t('commands:youtube.comments'), MiscUtils.formatNumber(statistics.commentCount, language), true)
      .addField(t('commands:youtube.channel'), `[${channelTitle}](https://www.youtube.com/channel/${channelId})`, true)
      .addField(t('commands:youtube.publishedAt'), moment(publishedAt).format('LLL'), true)
    return embed
  }

  getType ({ kind }) {
    return kind.split('#')[1]
  }
}
