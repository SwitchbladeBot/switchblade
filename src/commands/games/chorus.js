const { SearchCommand, SwitchbladeEmbed, MiscUtils } = require('../../')

const color = '#2C3E50'
const icon = 'https://chorus.fightthe.pw/assets/images/favicon_128.png'

module.exports = class Chorus extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'chorus',
      aliases: ['clonehero', 'chart'],
      requirements: {
        apis: ['chorus']
      },
      embedColor: color,
      embedLogoURL: icon
    })
  }

  async search (context, query) {
    const results = await this.client.apis.chorus.search(query)
    return results
  }

  searchResultFormatter (chart) {
    return `${chart.artist} - **[${chart.name}](${chart.link})**${chart.charter ? ` \`(${chart.charter})\`` : ''}`
  }

  async handleResult ({ t, channel, author, language }, chart) {
    const features = {
      hasOpen: chart.hasOpen && Object.keys(chart.hasOpen).length > 0,
      hasForced: chart.hasForced,
      hasTap: chart.hasTap,
      hasSections: chart.hasSections,
      hasSoloSections: chart.hasSoloSections,
      hasStarPower: chart.hasStarPower,
      hasStems: chart.hasStems,
      hasVideo: chart.hasVideo,
      hasLyrics: chart.hasLyrics,
    }

    const warnings = {
      driveFolder: chart.isFolder && chart.link,
      needsRenaming: chart.needsRenaming,
      is120: chart.is120,
      hasNoAudio: chart.hasNoAudio,
      no5FretLead: !chart.noteCounts || !chart.noteCounts.guitar,
      hasBrokenNotes: chart.hasBrokenNotes,
      notesAfterEnd: chart.length && chart.effectiveLength && chart.effectiveLength > chart.length
    }

    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(color)
        .setAuthor('chorus', icon, 'https://chorus.fightthe.pw/')
        .setTitle(`${chart.artist} - ${chart.name}`)
        .setDescription([
          chart.album ? `**${chart.album}${chart.year ? ` (${chart.year})` : ''}**` : undefined,
          chart.genre || undefined,
          `${MiscUtils.formatDuration(chart.length * 1000)} (${MiscUtils.formatDuration(chart.effectiveLength * 1000)})`,
          '',
          `${Object.keys(features).filter(k => features[k]).map(k => `\`${t(`commands:chorus.features.${k}`)}\``).join(', ')}`,
          '',
          ``,
          '',
          `[${this.getDownloadLinkText(chart, t)}](${chart.link})`,
          chart.sources[0] ? (chart.sources[0].isSetlist ? `[${t('commands:chorus.downloadFullSetlist', {setlistName: chart.sources[0].name})}](${chart.sources[0].link})` : undefined) : undefined
        ])
    )
  }

  getDownloadLinkText(chart, t) {
    if (!chart.charter) return t('commands:chorus.downloadHere', {charterName: chart.charter})
    if (chart.isPack) return t('commands:chorus.downloadPack', {charterName: chart.charter})
    return t('commands:chorus.downloadChart', {charterName: chart.charter})
  }
}
