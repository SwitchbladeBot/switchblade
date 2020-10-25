module.exports = class Matrix extends Array {
  constructor (rows, columns) {
    super()

    this.rows = rows
    this.columns = columns
  }

  populate (callback = () => 0) {
    for (let i = 0; i < this.rows; i++) {
      this[i] = []

      for (let j = 0; j < this.columns; j++) {
        this[i][j] = callback(i, j)
      }
    }
  }

  get (row, column) {
    return this[row][column]
  }

  set (row, column, value) {
    this[row][column] = value
  }
}
