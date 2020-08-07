const { Command, SwitchbladeEmbed, PaginatedEmbed, CommandError } = require('../../')
const moment = require('moment')

module.exports = class Emojis extends Command {
  constructor (client) {
    super({
      name: 'emojis',
      aliases: ['emojilist', 'emojislist', 'guildemojis', 'serveremojis'],
      category: 'utility',
      requirements: { guildOnly: true, botPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'] }
    }, client)
  }

  async run ({ message, t, author, channel, language }) {
    const emojisCache = message.guild.emojis.cache
    const guildEmojis = emojisCache.filter(emoji => emoji.available & !emoji.animated).array()
    const animatedEmojis = emojisCache.filter(emoji => emoji.available && emoji.animated).array()
    const emojisText = []
    const embeds = []
    const textPerEmbed = []

    if (guildEmojis.length === 0 && animatedEmojis.length === 0) {
      throw new CommandError(t('errors:guildHasNoEmoji'))
    }

    moment.locale(language)
    guildEmojis.forEach((emoji) => {
      emojisText.push(`${emoji.toString()} **${emoji.name}** \`\`<:${emoji.name}:${emoji.id}>\`\``)
    })

    guildEmojis.splice(0, guildEmojis.length)
    animatedEmojis.forEach((emoji) => {
      emojisText.push(`${emoji.toString()} **${emoji.name}** \`\`<:${emoji.name}:${emoji.id}>\`\``)
    })

    animatedEmojis.splice(0, animatedEmojis.length)
    let i
    let text = ''
    for (i = 0; i < emojisText.length; i++) {
      const messageLength = text.length + emojisText[i].length + 1
      if (messageLength >= 2048) {
        textPerEmbed.push(text)
        text = emojisText[i]
      } else {
        text += `\n${emojisText[i]}`
      }
    }

    emojisText.splice(0, emojisText.length)
    for (let f = 0; f < textPerEmbed.length; f++) {
      const currentEmbed = new SwitchbladeEmbed(author)
      currentEmbed.setDescription(textPerEmbed[f])
      await embeds.push(currentEmbed)
    }

    textPerEmbed.splice(0, textPerEmbed.length)
    const pages = new PaginatedEmbed(t, author)

    embeds.forEach((embed) => {
      pages.addPage(embed)
    })

    embeds.splice(0, embeds.length)
    try {
      const msg = await channel.send(t('commands:emojis.loading'))
      pages.run(msg)
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
