const fetch = require('node-fetch')

module.exports = class Reddit {
  static async getRandomPostFromSubreddit (subReddit) {
    subReddit = subReddit.replace('/r/', '')
    let body = await fetch(`https://reddit.com/r/${subReddit}/random/.json`).then(res => res.json())
    return body[0] && body[0].data.children[0].data
  }
}
