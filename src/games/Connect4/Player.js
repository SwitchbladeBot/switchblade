const { Player } = require('../..')
const { LABELS } = require('./constants')

module.exports = class Connect4Player extends Player {
  get label () {
    return LABELS[this.code]
  }

  play (column) {
    this.game.board.add(column, this.code)
  }

  won () {
    return this.game.board.hasRow(this.code) ||
      this.game.board.hasColumn(this.code) ||
      this.game.board.hasDiagonal(this.code) ||
      this.game.board.hasReverseDiagonal(this.code)
  }

  toString () {
    return `${this.label} ${this.user}`
  }
}
