const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter } = CommandStructures
const snekfetch = require('snekfetch')
const moment = require('moment')

const sizeLimit = 1000000
const sizeLimitHumanReadable = '1 MB'

module.exports = class WhatAnime extends Command {
  constructor (client) {
    super(client)
    this.name = 'whatanime'

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, required: false})
    )
  }

  canLoad () {
    return !!process.env.WHATANIME_API_KEY
  }

  async run ({ t, author, channel, message }, urlFromParams) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const imageUrl = urlFromParams || await lastImageFromChannel(channel)
    const image = await snekfetch.get(imageUrl)

    try {
      if (image.body.length < sizeLimit) {
        const response = await snekfetch.post(`https://whatanime.ga/api/search?token=${process.env.WHATANIME_API_KEY}`).attach('image', image.body.toString('base64'))
        if (response.body.docs && response.body.docs[0].similarity > 0.80) {
          const bestMatch = response.body.docs[0]

          if (!(bestMatch.is_adult && !channel.nsfw)) {
            embed
              .setTitle(t('commands:whatanime.matchFound'))
              .setImage(`https://whatanime.ga/thumbnail.php?anilist_id=${bestMatch.anilist_id}&file=${encodeURIComponent(bestMatch.filename)}&t=${bestMatch.at}&token=${bestMatch.tokenthumb}`)
              .setDescription([
                t('commands:whatanime.matchName', {animeName: bestMatch.title_romaji, episodeNumber: bestMatch.episode}),
                t('commands:whatanime.matchDuration', {matchStart: moment.duration(bestMatch.from * 1000).format('h[h] m[m] s[s]'), matchEnd: moment.duration(bestMatch.to * 1000).format('h[h] m[m] s[s]')}),
                '',
                `[AniList](https://anilist.co/anime/${bestMatch.anilist_id}) - [MyAnimeList](https://myanimelist.net/anime/${bestMatch.mal_id})`
              ].join('\n'))
          } else {
            embed
              .setTitle()
              .setDescription(t('commands:whatanime.channelIsNotNSFWDescription'))
          }
        } else {
          embed.setTitle('Not found')
        }
      } else {
        embed
          .setTitle(t('commands:whatanime.imageTooBigTitle'))
          .setDescription(t('commands:whatanime.imageTooBigDescription', {sizeLimit: sizeLimitHumanReadable}))
      }
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      console.log(e.message)

      switch (e.message) {
        case '429 Too Many Requests':
          embed
            .setTitle(t('commands:whatanime.rateLimitExceededTitle'))
            .setDescription(t('commands:whatanime.rateLimitExceededDescription'))
          break
        case '413 Request Entity Too Large':
          embed
            .setTitle(t('commands:whatanime.imageTooBigTitle'))
            .setDescription(t('commands:whatanime.imageTooBigDescription', {sizeLimit: sizeLimitHumanReadable}))
          break
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}

async function lastImageFromChannel (channel) {
  const channelMessages = await channel.fetchMessages()
  return channelMessages.find(m => m.attachments.filter(a => a.height).first()).attachments.first().url
}
