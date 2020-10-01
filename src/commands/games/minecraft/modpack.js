const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../../')
const moment = require('moment')

module.exports = class MinecraftModpack extends SearchCommand {
  constructor (client) {
    super({
      name: 'modpack',
      aliases: ['curseforge', 'm', 'twitch'],
      parent: 'minecraft',
      embedColor: Constants.CURSEFORGE_COLOR,
      embedLogoURL: 'https://minecraft-hosting.com/wp-content/uploads/2019/01/curseforge.png'
    }, client)
  }

  async search (_, query) {
    return this.client.apis.curseforge.searchAddon(432, query)
  }

  searchResultFormatter (items) {
    return `[${items.name}](${items.websiteUrl})`
  }

  async handleResult ({ t, channel, author, language }, { name, websiteUrl, summary, attachments, downloadCount, dateReleased, latestFiles }) {
    moment.locale(language)
    channel.send(
      new SwitchbladeEmbed(author)
        .setThumbnail(attachments[0].url)
        .setAuthor(name, 'https://minecraft-hosting.com/wp-content/uploads/2019/01/curseforge.png', websiteUrl)
        .setColor(Constants.CURSEFORGE_COLOR)
        .setDescription(summary)
        .addField(t('commands:minecraft.subcommands.modpack.downloadCount'), downloadCount, true)
        .addField(t('commands:minecraft.subcommands.modpack.releasedAt'), moment(dateReleased).format('LL'), true)
        .addField('\u200B', `[${t('commands:minecraft.subcommands.modpack.directDownload')}](${latestFiles[0].downloadUrl})`)
    )
  }
}
