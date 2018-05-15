const snekfetch = require('snekfetch')
let reddit = module.exports = {}

reddit.getRandomPostFromSubreddit = async function randomSub (str) {
  let subreddit = str.replace('/r/', '')
  let { body } = await snekfetch.get(`https://reddit.com/r/${subreddit}/random/.json`)
  return body[0].data.children[0].data
}
