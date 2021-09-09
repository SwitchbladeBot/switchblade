const { Command, CommandError, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class e621 extends Command {
  constructor (client) {
    super({
      name: 'e621',
      category: 'nsfw',
      requirements: {
        apis: ['e621']
      },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:e621.noQuery'
      }]
    }, client)
  }

  async run ({ t, author, channel }, query) {
    channel.startTyping()
    const tags = channel.nsfw ? 'https://e621.net' : 'https://e926.net'
    const { posts } = await this.client.apis.e621.searchPost(`${channel.nsfw ? '' : 'rating:s -rating:e'} ${query} -flash -webm`, tags)
    try {
      channel.send(
        new SwitchbladeEmbed()
          .setImage(posts[0].file.url)
          .setTitle(`${t('commands:e621.id')}: ${posts[0].id}`)
          .setDescription(`**${t('commands:e621.artist')}**: "${posts[0].tags.artist[0] || 'Unknown artist'}"\n**${t('commands:e621.desc')}**: "${posts[0].description.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, '') || 'No Description'}"\n **ID**: ${posts[0].id}\n[${t('commands:e621.post')}](https://e621.net/posts/${posts[0].id})`)
          .setColor(Constants.E621_COLOR)
      )
      channel.stopTyping(true)
    } catch (e) {
      channel.stopTyping(true)
      throw new CommandError(`${t('commands:e621.notFound')}`)
    }
  }
}
