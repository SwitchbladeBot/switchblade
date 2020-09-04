const { Command, SwitchbladeEmbed, PaginatedEmbed, CommandError } = require('../../')
function compare (a, b) {
  if (a.position < b.position) return 1
  if (a.position > b.position) return -1
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

  async run ({ message, t, author, channel }) {
    const pagesArr = message.guild.roles.cache
      .sort(compare)
      .reduce((descriptionArr, role, id) => {
        const line = `<@&${id}> \`\`<@&${id}>\`\``
        const [lastDescription] = descriptionArr.slice(-1)
        if (lastDescription && ([...lastDescription, line]).join('\n').length < 2048) {
          lastDescription.push(line)
        } else {
          descriptionArr.push([line])
        }
        return descriptionArr
      }, [])
      .map(desc => new SwitchbladeEmbed(author).setDescription(desc.join('\n')))

    if (pagesArr.length < 0) {
      throw new CommandError(t('errors:guildHasNoRole'))
    }

    const pages = new PaginatedEmbed(t, author, pagesArr)
    pages.run(channel)
  }
}
