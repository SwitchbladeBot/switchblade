const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class SnapCraft extends SearchCommand {
  constructor (client) {
    super({
      name: 'snapcraft',
      category: 'utility',
      aliases: ['snap', 'snapd', 'snappy'],
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:snapcraft.noQueryProvided'
      }],
      embedLogoURL: 'https://dashboard.snapcraft.io/site_media/appmedia/2018/04/Snapcraft-logo-bird.png',
      embedColor: Constants.SNAPCRAFT_COLOR
    }, client)
  }

  async search (context, query) {
    return this.client.apis.snapcraft.searchApp(query)
  }

  searchResultFormatter (app) {
    return `[${app.title}](${app.storeURL}) - \`${app.version}\``
  }

  handleResult ({ channel, author, t }, { storeURL, title, description, icon, version, branch, publisher }) {
    const embed = new SwitchbladeEmbed(author)
      .setAuthor('Snapcraft', this.embedLogoURL, 'https://snapcraft.io/')
      .setColor(this.embedColor)
      .setURL(storeURL)
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(icon)
      .addFields([
        {
          name: t('commands:snapcraft.version'),
          value: `${branch} - \`${version}\``
        },
        {
          name: t('commands:snapcraft.publisher'),
          value: `${publisher.displayName} - \`${publisher.username}\`
          ${t('commands:snapcraft.verified')} - \`${publisher.verified ? t('commands:snapcraft.yes') : t('commands:snapcraft.no')}\``
        }
      ])
    channel.send(embed)
  }
}
