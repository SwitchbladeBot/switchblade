const { Command, SwitchbladeEmbed, PaginatedEmbed, CommandError } = require('../../')

module.exports = class EmojiList extends Command {
  constructor (client) {
    super({
      name: 'emojilist',
      aliases: ['emojis', 'emojislist', 'guildemojis', 'serveremojis'],
      category: 'utility',
      requirements: { guildOnly: true, botPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'] }
    }, client)
  }

  async run ({ message, t, author, channel, language }) {
    const emojisCache = message.guild.emojis.cache.filter(emoji => emoji.available)
    const emojisText = []
    const embeds = []
    const textPerEmbed = []

    if (emojisCache.size < 0) {
      throw new CommandError(t('errors:guildHasNoEmoji'))
    }

    emojisCache.forEach((emoji, id) => {
      emojisText.push(`${emoji.toString()} **${emoji.name}** \`\`<:${emoji.name}:${id}>\`\``)
    })

    emojisCache.clear()
    let i, l
    for (i = 0, l = 0; i < emojisText.length; i++) {
      if (i > 0 && textPerEmbed[l] && (textPerEmbed[l].length + emojisText[i].length + 1) >= 2048) {
        l++
      }

      textPerEmbed[l]
        ? textPerEmbed[l] += `\n${emojisText[i]}`
        : textPerEmbed[l] = emojisText[i]
    }

    emojisText.splice(0, emojisText.length)
    textPerEmbed.forEach((text) => {
      const currentEmbed = new SwitchbladeEmbed(author)
      currentEmbed.setDescription(text)
      embeds.push(currentEmbed)
    })

    textPerEmbed.splice(0, textPerEmbed.length)
    const pages = new PaginatedEmbed(t, author)

    embeds.forEach((embed) => {
      pages.addPage(embed)
    })

    embeds.splice(0, embeds.length)
    try {
      const msg = await channel.send(t('commands:emojilist.loading'))
      pages.run(msg)
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
