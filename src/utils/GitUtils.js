const axios = require('axios')
const fs = require('fs')

module.exports = class GitUtils {
  static async getHashOrBranch () {
    const rev = fs.readFileSync('.git/HEAD').toString().trim()

    if (rev.startsWith('ref:')) {
      const branch = rev.replace(/^ref: refs\/heads\//, '')
      const localHash = fs.readFileSync('.git/' + rev.substring(5)).toString().trim()

      let res
      try {
        res = await axios.get(`https://api.github.com/repos/SwitchbladeBot/switchblade/commits/${branch}`)
      } catch (_) {
        return false
      }

      const originHash = Array.isArray(res.data) ? res.data[0].sha : res.data.sha
      if (
        (Array.isArray(res.data) && !res.data.some((c) => c.sha === localHash)) ||
        (!Array.isArray(res.data) && res.data.sha !== localHash)
      ) return false

      return localHash === originHash ? branch : localHash
    } else {
      return rev
    }
  }
}
