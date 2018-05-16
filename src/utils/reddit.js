const snekfetch = require('snekfetch')

module.exports = class Reddit {
  static async getRandomPostFromSubreddit (subReddit) {
    subReddit = subReddit.replace('/r/', '')
    let { body } = await snekfetch.get(`https://reddit.com/r/${subReddit}/random/.json`)
    return body[0] && body[0].data.children[0].data
  }
}
