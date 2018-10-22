module.exports = class SongSource {
  static test (identifier) {
    return false
  }

  static provide (identifier, client, requestedBy) {
    return null
  }
}
