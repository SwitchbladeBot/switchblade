module.exports = class BlacklistUtils {
  static async addUser (userDocument, reason, blacklister) {
    userDocument.blacklisted = true
    userDocument.blacklistReason = reason
    userDocument.blacklisterId = blacklister.id
    userDocument.save()
  }

  static async removeUser (userDocument) {
    if (!userDocument.blacklisted) return false
    userDocument.blacklisted = true
    userDocument.blacklistReason = ''
    userDocument.blacklisterId = ''
    userDocument.save()
    return true
  }

  static async getInfo (userDocument) {
    if (!userDocument.blacklisted) return false
    return { reason: userDocument.blacklistReason, blacklisterId: userDocument.blacklisterId }
  }
}
