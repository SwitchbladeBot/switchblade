module.exports = {
  ratingToStarEmoji: function (rating) {
    return '<:ratingstar:458381544357101580>'.repeat(Math.floor(rating)) + ((rating % 1).toFixed(1) !== 0 ? '<:ratinghalfstar:458381544571273224>' : '')
  },

  formatBytes: function (a, b) {
    if (a === 0) return '0 Bytes'
    const c = 1024
    const d = b || 2
    const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const f = Math.floor(Math.log(a) / Math.log(c))
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
  }
}
