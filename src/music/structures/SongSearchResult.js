module.exports = class SongSearchResult {
  constructor (tryAgain = true) {
    this.tryAgain = tryAgain
  }

  async setResult (result) {
    this.result = await result
    return this
  }

  static async from (result, tryAgain = true) {
    const searchResult = new this(tryAgain)
    return searchResult.setResult(await result)
  }
}
