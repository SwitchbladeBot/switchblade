const snekfetch = require("snekfetch")
const cheerio = require("cheerio")
const key = process.env.GENIUS_API

module.exports = class Lyrics {
  static async getLyrics(path) {
    return snekfetch.get(`https://api.genius.com/${path}`)
     .set("Authorization", `Bearer ${key}`)
     .then(res => res.body)
     .catch(err => console.err)
  }
  static loadLyrics(url) {
    return snekfetch.get(url).then(res => {
      const $ = cheerio.load(res.body)
      return $(".lyrics") ? $(".lyrics").text().trim() : null
    })
  }
}
