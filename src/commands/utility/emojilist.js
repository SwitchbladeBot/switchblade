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

  async run ({ message, t, author, channel }) {
    const pages = message.guild.emojis.cache
      .filter(emoji => emoji.available)
      .reduce((descriptionArr, emoji, id) => {
        const line = `${emoji.toString()} **${emoji.name}** \`\`<:${emoji.name}:${id}>\`\``
        const [lastDescription] = descriptionArr.slice(-1)
        if (lastDescription && [...lastDescription, line].join('\n').length < 2048) {
          lastDescription.push(line)
        } else {
          descriptionArr.push([line])
        }
        return descriptionArr
      }, [])

    if (pages.length === 0) {
      throw new CommandError(t('errors:guildHasNoEmoji'))
    }

    const embed = new PaginatedEmbed(t, author, pages.map(desc => new SwitchbladeEmbed(author).setDescription(desc.join('\n'))))
    embed.run(channel)
  }
}
