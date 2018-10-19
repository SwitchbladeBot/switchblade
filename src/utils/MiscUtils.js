module.exports = class MiscUtils {
  static findArrayDuplicates (arr) {
    return arr.filter((value, index) => {
      return arr.indexOf(value) !== index
    })
  }
}
