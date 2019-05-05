const { Command, SwitchbladeEmbed, CommandError, Constants } = require('../../')
const snekfetch = require('snekfetch')
const moment = require('moment')

const sizeLimit = 1000000

module.exports = class WhatAnime extends Command {
  constructor (client) {
    super(client, {
      name: 'whatanime',
      aliases: ['tracemoe', 'aname'],
      category: 'images',
      parameters: [{
        type: 'image',
        missingError: 'commands:whatanime.missingImage',
        acceptGifs: true
      }]
    })
  }

  async run ({ t, author, channel, message }, image) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)

    if (image.byteLength > sizeLimit) throw new CommandError(t('commands:whatanime.imageTooBigTitle'))

    try {
      const response = await snekfetch.post(`https://trace.moe/api/search?token=${process.env.TRACEMOE_API_KEY}`).attach('image', image.toString('base64'))
      if (response.body.docs && response.body.docs[0].similarity > 0.87) {
        const bestMatch = response.body.docs[0]
          if (!(bestMatch.is_adult && !channel.nsfw)) {
            embed
              .setTitle(t('commands:whatanime.matchFound'))
              .setImage(`https://trace.moe/thumbnail.php?anilist_id=${bestMatch.anilist_id}&file=${encodeURIComponent(bestMatch.filename)}&t=${bestMatch.at}&token=${bestMatch.tokenthumb}`)
              .setDescription([
                t('commands:whatanime.matchName', {animeName: bestMatch.title_romaji, episodeNumber: bestMatch.episode}),
                t('commands:whatanime.matchDuration', {matchStart: moment.duration(bestMatch.from * 1000).format('h[h] m[m] s[s]'), matchEnd: moment.duration(bestMatch.to * 1000).format('h[h] m[m] s[s]')}),
                '',
                `[AniList](https://anilist.co/anime/${bestMatch.anilist_id}) - [MyAnimeList](https://myanimelist.net/anime/${bestMatch.mal_id})`
              ])
          } else {
            embed
              .setTitle(t('commands:whatanime.channelIsNotNSFWTitle'))
              .setDescription(t('commands:whatanime.channelIsNotNSFWDescription'))
          }
        } else {
          embed.setTitle(t('commands:whatanime.noMatchFound'))
        }
    } catch (e) {
      if (e.message === '429 Too Many Requests') throw new CommandError(t('commands:whatanime.rateLimitExceededTitle'))
      if (e.message === '413 Request Entity Too Large') throw new CommandError(t('commands:whatanime.imageTooBigTitle'))
      throw new CommandError('errors:generic')
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}