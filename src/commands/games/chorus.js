const { SearchCommand, SwitchbladeEmbed, MiscUtils, Constants } = require('../../')

const icon = 'https://chorus.fightthe.pw/assets/images/favicon_128.png'
const instruments = ['drums', 'guitarghl', 'keys', 'guitar', 'bassghl', 'bass']
const warningLinks = {
  driveFolderExampleLink: 'https://i.imgur.com/DsTwJsv.png'
}

module.exports = class Chorus extends SearchCommand {
  constructor (client) {
    super({
      name: 'chorus',
      aliases: ['clonehero', 'chart'],
      requirements: {
        apis: ['chorus']
      },
      embedColor: Constants.CHORUS_COLOR,
      embedLogoURL: icon
    }, client)
  }

  async search (context, query) {
    const results = await this.client.apis.chorus.search(query)
    return results
  }

  searchResultFormatter (chart) {
    return `${chart.artist} - **[${chart.name}](${chart.link})**${chart.noteCounts && chart.noteCounts.guitar ? ` **[${this.getDifficultyString(chart.noteCounts.guitar)}]**` : ''}${chart.charter ? ` \`(${chart.charter})\`` : ''}`
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
      hasLyrics: chart.hasLyrics
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

    const nps = this.getNotePerSecondAverage(chart.effectiveLength, chart.noteCounts)

    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(Constants.CHORUS_COLOR)
        .setAuthor('chorus', icon, 'https://chorus.fightthe.pw/')
        .setTitle(`${chart.artist} - ${chart.name}`)
        .setDescriptionFromBlockArray([
          [
            chart.album ? `**${chart.album}${chart.year ? ` (${chart.year})` : ''}**` : (chart.year ? `**${chart.year}**` : null), // Album name (album year)
            chart.genre,
            chart.length && chart.effectiveLength ? `${MiscUtils.formatDuration(chart.length * 1000)} (${MiscUtils.formatDuration(chart.effectiveLength * 1000)})` : null // Chart length (effective length)
          ],
          [
            Object.keys(features).filter(k => features[k]).map(k => `\`${t(`commands:chorus.features.${k}`)}\``).join(', ') // Chart features
          ],
          [
            Object.keys(warnings).filter(k => warnings[k]).map(k => `**>** _${t(`commands:chorus.warnings.${k}`, warningLinks)}_`).join('\n') // Chart warnings
          ],
          [
            `**${this.getNotePerSecondRating(t, nps)}**`, // NPS Rating
            t('commands:chorus.notesPerSecond', { nps }) // NPS average
          ],
          [
            chart.noteCounts && Object.keys(chart.noteCounts).filter(i => instruments.includes(i)).length > 0 ? `${Object.keys(chart.noteCounts).filter(i => instruments.includes(i)).map(i => `${this.getEmoji(i)} ${this.getDifficultyString(chart.noteCounts[i])}`).join(' ')}` : null // Difficulties per instrument
          ],
          [
            `[${this.getDownloadLinkText(chart, t)}](${chart.link})`, // Download link
            chart.sources[0] ? (chart.sources[0].isSetlist && chart.sources[0].name && chart.sources[0].link ? `[${t('commands:chorus.downloadFullSetlist', { setlistName: chart.sources[0].name })}](${chart.sources[0].link})` : null) : null // Download full setlist link
          ]
        ])
        .addField(t('commands:chorus.source', { count: chart.sources.length }), chart.sources.map(s => `${s.parent ? `[${s.parent.name}](${s.parent.link}) in ` : ''}${`[${s.name}](${s.link})`}`).join('\n'))
    )
  }

  getDownloadLinkText (chart, t) {
    if (!chart.charter) return t('commands:chorus.downloadHere', { charterName: chart.charter })
    if (chart.isPack) return t('commands:chorus.downloadPack', { charterName: chart.charter })
    return t('commands:chorus.downloadChart', { charterName: chart.charter })
  }

  getDifficultyString (instrument) {
    let string = ''
    if (instrument.e) string += 'E'
    if (instrument.m) string += 'M'
    if (instrument.h) string += 'H'
    if (instrument.x) string += 'X'
    return string
  }

  getNotePerSecondAverage (length, noteCounts) {
    if (!noteCounts) return 0
    const instrument = noteCounts.guitar ? 'guitar' : Object.keys(noteCounts)[0]
    if (!instrument || !noteCounts[instrument]) return 0
    const difficulty = ['x', 'h', 'm', 'e'].find(d => noteCounts[instrument][d])
    return (noteCounts[instrument][difficulty] / length).toFixed(2)
  }

  getNotePerSecondRating (t, average) {
    return average > 15 ? t('commands:chorus.noteDensityRatings.15') : t(`commands:chorus.noteDensityRatings.${average >> 0}`)
  }
}
