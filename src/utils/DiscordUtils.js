module.exports = class DiscordUtils {
  /**
  * @param  {String} userID - The id of the user who should have permission checked.
  * @param  {Object} channel - The channel from the message.
  * @param  {Array<String>} permissions - An Array with discord permissions.
  * @param  {Function} t - The translate function.
  * @param  {String} blameWho - Who to blame if the permission is missing.
  * @returns {String}
  */
  static ensurePermissions (userID, channel, permissions, t, blameWho) {
    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i]
      if (!channel.permissionsFor(userID).has(permission)) {
        return t(blameWho === 'bot' ? 'errors:iDontHavePermission' : 'errors:youDontHavePermissionToRead', { permission })
      }
    }

    return null
  }
}
