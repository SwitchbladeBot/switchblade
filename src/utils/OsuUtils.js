module.exports = class OsuUtils {
  static get modes() {
    return ['osu', 'taiko', 'catch', 'mania']
  }

  static calculateAccuracy(score, mode) {
    console.log(score)
    console.log(mode)
    switch (mode) {
      case 'osu':
        return ((50*score.count50 + 100*score.count100 + 300*score.count300)/(300*score.countmiss + 300*score.count50 + 300*score.count100 + 300*score.count300) * 100).toFixed(2)
      // TODO - Add formulas for the other gamemodes
    }
  }

  static calculateMods(number) {
    // TODO - Write this function
  }
}