const { SearchCommand, SwitchbladeEmbed } = require('../../')

module.exports = class BeatSaver extends SearchCommand {
  constructor (client) {
    super({
      name: 'beatsaver',
      aliases: ['beatsaber', 'bsaver'],
      category: 'games',
      embedColor: 0x3C347B,
      embedLogoURL: 'https://i.imgur.com/yK8SmyX.png'
    }, client)
  }

  search (context, query) {
    return this.client.apis.beatsaver.searchMaps(query)
  }

  searchResultFormatter ({ metadata, key, uploader }) {
    return `[${metadata.songName}](${'https://beatsaver.com/beatmap/' + key}) - [${metadata.levelAuthorName}](${'https://beatsaver.com/uploader/' + uploader._id})`
  }

  async handleResult ({ t, channel, author }, map) {
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor('Beat Saver', 'https://i.imgur.com/yK8SmyX.png')
      .setTitle(map.metadata.songName)
      .setThumbnail('https://beatsaver.com' + map.coverURL)
      .setDescription([
        map.description,
        '',
        `**[${t('commands:beatsaver.download')}](${'https://beatsaver.com' + map.directDownload})** - [${t('commands:beatsaver.details')}](${'https://beatsaver.com/beatmap/' + map.key})`
      ])
      .setTimestamp(new Date(map.uploaded))
      .setFooter(map.metadata.levelAuthorName)

    channel.send(embed).then(() => channel.stopTyping())
  }
}
