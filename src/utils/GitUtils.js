const axios = require('axios')
const fs = require('fs')
const child = require('child_process')

module.exports = class GitUtils {
  static async getHashOrBranch (user, repository, fallbackBranch = 'master') {
    try {
      const rev = fs.readFileSync('.git/HEAD').toString().trim()

      if (rev.startsWith('ref:')) {
        const branch = rev.replace(/^ref: refs\/heads\//, '')
        const localHash = fs.readFileSync('.git/' + rev.substring(5)).toString().trim()

        let res
        try {
          res = await axios.get(`https://api.github.com/repos/${user}/${repository}/commits/${branch}`)
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
    } catch (_) {
      let res
      try {
        res = await axios.get(`https://api.github.com/repos/${user}/${repository}/commits/${fallbackBranch}`)
      } catch (__) {
        return false
      }

      const sha = Array.isArray(res.data) ? res.data[0].sha : res.data.sha

      return sha.length > 7 ? sha.slice(0, 7) : sha
    }
  }

  static async getLatestCommitInfo (user, repository, fallbackBranch) {
    const branchOrHash = await GitUtils.getHashOrBranch(user, repository, fallbackBranch)
    if (!branchOrHash && branchOrHash !== null) {
      const data = child.execSync('git log --pretty=format:"%cn | %cd"').toString()
      const [user, ...date] = data.split('\n')[0].split('|')
      return {
        date: new Date(...date),
        user
      }
    }

    let res
    try {
      res = await axios.get(`https://api.github.com/repos/SwitchbladeBot/switchblade/commits/${branchOrHash}`)
    } catch (_) {
      return false
    }

    if (res.data && res.data.author && res.data.commit) {
      const originCommiter = res.data.author.login
      const originDate = new Date(res.data.commit.author.date)
      return {
        date: originDate,
        user: originCommiter
      }
    }
  }
}
