module.exports = class Blacklist {
  static async addUser (userDocument, reason) {
    userDocument.blacklisted = true
    userDocument.blacklistReason = reason
    userDocument.save()
  }

  static async removeUser (userDocument) {
    if (!userDocument.blacklisted) return false
    userDocument.blacklisted = true
    userDocument.blacklistReason = ''
    userDocument.save()
    return true;
  }
}
