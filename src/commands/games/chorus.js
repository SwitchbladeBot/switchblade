const { SearchCommand, SwitchbladeEmbed, MiscUtils, Constants } = require('../../')

const color = '#2C3E50'
const icon = 'https://chorus.fightthe.pw/assets/images/favicon_128.png'
const instruments = ['drums', 'guitarghl', 'keys', 'guitar', 'bassghl', 'bass']
const warningLinks = {
  driveFolderExampleLink: 'https://i.imgur.com/DsTwJsv.png'
}

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
    return `${chart.artist} - **[${chart.name}](${chart.link})**${chart.noteCounts.guitar ? ` **[${this.getDifficultyString(chart.noteCounts.guitar)}]**` : ''}${chart.charter ? ` \`(${chart.charter})\`` : ''}`
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
          chart.album ? `**${chart.album}${chart.year ? ` (${chart.year})` : ''}**` : undefined, // Album name (album year)
          chart.genre || undefined, // Chart genre
          `${MiscUtils.formatDuration(chart.length * 1000)} (${MiscUtils.formatDuration(chart.effectiveLength * 1000)})`, // Chart length (effective length)
          '', // Empty line
          Object.keys(features).filter(k => features[k]).map(k => `\`${t(`commands:chorus.features.${k}`)}\``).join(', '), // Chart features
          Object.keys(features).filter(k => features[k]) ? '' : undefined, // Add an empty line if there are features
          Object.keys(warnings).filter(k => warnings[k]).map(k => `**>** _${t(`commands:chorus.warnings.${k}`, warningLinks)}_`).join('\n'),
          Object.keys(warnings).filter(k => warnings[k]) ? '' : undefined, // Add an empty line if there are warnings
          `**${this.getNotePerSecondRating(t, this.getNotePerSecondAverage(chart.length, chart.noteCounts))}**`, // NPS Rating
          t('commands:chorus.notesPerSecond', {nps: this.getNotePerSecondAverage(chart.length, chart.noteCounts)}), // NPS average
          '', // Empty line
          `${Object.keys(chart.noteCounts).filter(i => instruments.includes(i)).map(i => `${Constants[`CLONEHERO_${i.toUpperCase()}`]} ${this.getDifficultyString(chart.noteCounts[i])}`).join(' ')}`, // Difficulties per instrument
          Object.keys(chart.noteCounts).length > 0 ? '' : undefined, // Add an empty line if there are difficulties being shown
          `[${this.getDownloadLinkText(chart, t)}](${chart.link})`, // Download link
          chart.sources[0] ? (chart.sources[0].isSetlist && chart.sources[0].name && chart.sources[0].link ? `[${t('commands:chorus.downloadFullSetlist', {setlistName: chart.sources[0].name})}](${chart.sources[0].link})` : undefined) : undefined // Download full setlist link
        ])
        .addField(t('commands:source'))
    )
  }

  getDownloadLinkText(chart, t) {
    if (!chart.charter) return t('commands:chorus.downloadHere', {charterName: chart.charter})
    if (chart.isPack) return t('commands:chorus.downloadPack', {charterName: chart.charter})
    return t('commands:chorus.downloadChart', {charterName: chart.charter})
  }

  getDifficultyString(instrument) {
    let string = ''
    if (instrument.e) string += 'E'
    if (instrument.m) string += 'M'
    if (instrument.h) string += 'H'
    if (instrument.x) string += 'X'
    return string
  }

  getNotePerSecondAverage(length, noteCounts = {}) {
    const instrument = noteCounts.guitar ? "guitar" : Object.keys(noteCounts)[0]
    if (!instrument || !noteCounts[instrument]) return 0
    const difficulty = ["x", "h", "m", "e"].find(d => noteCounts[instrument][d])
    return (noteCounts[instrument][difficulty] / length).toFixed(2)
  }

  getNotePerSecondRating(t, average) {
    return average > 15 ? t(`commands:chorus.noteDensityRatings.15`) : t(`commands:chorus.noteDensityRatings.${average >> 0}`)
  }
}
