const { Matrix } = require('../..')
const { LABELS } = require('./constants')

module.exports = class Board extends Matrix {
  constructor () {
    super(6, 7)

    this.populate()
  }

  isFull () {
    return this.every((row) => row.every((value) => value !== 0))
  }

  isColumnFull (column) {
    for (let i = 0; i < this.rows; i++) {
      if (this.get(i, column) === 0) return false
    }

    return true
  }

  add (column, value) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (this.get(i, column) === 0) {
        this.set(i, column, value)
        break
      }
    }
  }

  hasRow (value) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          this.get(i, j) === value &&
          this.get(i, j + 1) === value &&
          this.get(i, j + 2) === value &&
          this.get(i, j + 3) === value
        ) return true
      }
    }

    return false
  }

  hasColumn (value) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          this.get(i, j) === value &&
          this.get(i + 1, j) === value &&
          this.get(i + 2, j) === value &&
          this.get(i + 3, j) === value
        ) return true
      }
    }

    return false
  }

  hasDiagonal (value) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          this.get(i, j) === value &&
          this.get(i + 1, j + 1) === value &&
          this.get(i + 2, j + 2) === value &&
          this.get(i + 3, j + 3) === value
        ) return true
      }
    }

    return false
  }

  hasReverseDiagonal (value) {
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 7; j++) {
        if (
          this.get(i, j) === value &&
          this.get(i + 1, j - 1) === value &&
          this.get(i + 2, j - 2) === value &&
          this.get(i + 3, j - 3) === value
        ) return true
      }
    }

    return false
  }

  render () {
    return this.map((row) => {
      return row.map((value) => LABELS[value]).join('')
    }).join('\n')
  }
}
