const { Command, SwitchbladeEmbed, PaginatedEmbed, CommandError } = require('../../')
const { text } = require('figlet')

function compare (a, b) {
  if (a.position < b.position) return -1
  if (a.position > b.position) return 1
  return 0
}
module.exports = class RoleList extends Command {
  constructor (client) {
    super({
      name: 'rolelist',
      aliases: ['roles', 'roleslist', 'guildroles', 'serverroles'],
      category: 'utility',
      requirements: { guildOnly: true, botPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'] }
    }, client)
  }

  async run ({ message, t, author, channel, language }) {
    let rolesCache = message.guild.roles.cache.sort(compare)
    const rolesText = []
    const idsText = []
    const embeds = []
    const textPerEmbed = []

    rolesCache.forEach((role) => {
      rolesText.push(`<@&${role.id}>`)
      idsText.push(`\`\`<@&${role.id}>\`\``)
    })

    rolesCache.clear()
    let i, l
    for (i = 0, l = 0; i < rolesText.length; i++) {
      const [roleText, idText] = [rolesText[i], idsText[i]]

      if (i > 0 && textPerEmbed[l] && ((textPerEmbed[l][0].length + roleText.length + 1) >= 1024 || (textPerEmbed[l][1].length + idText.length + 1) >= 1024)) {
        l++
      }

      if (textPerEmbed[l]) {
        textPerEmbed[l][0] += `\n${roleText}`
        textPerEmbed[l][1] += `\n${idText}`
      } else {
        textPerEmbed[l] = []
        textPerEmbed[l][0] = roleText
        textPerEmbed[l][1] = idText
      }
    }

    rolesText.splice(0, rolesText.length)
    textPerEmbed.forEach((group) => {
      const currentEmbed = new SwitchbladeEmbed(author)
      currentEmbed.addField(t('commands:rolelist.roles'), group[0], true)
      currentEmbed.addField(t('commands:rolelist.ids'), group[1], true)
      embeds.push(currentEmbed)
    })

    textPerEmbed.splice(0, textPerEmbed.length)
    const pages = new PaginatedEmbed(t, author)

    embeds.forEach((embed) => {
      pages.addPage(embed)
    })

    embeds.splice(0, embeds.length)
    try {
      const msg = await channel.send(t('commands:rolelist.loading'))
      pages.run(msg)
    } catch (e) {
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
