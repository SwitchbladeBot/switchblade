const { Command, CommandError, SwitchbladeEmbed, Constants, PaginatedEmbed } = require('../../../')

module.exports = class GenhsinImpactCharacter extends Command {
  constructor (client) {
    super({
      name: 'character',
      aliases: ['c'],
      parent: 'genshinimpact',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:freefire.subcommands.weapon.missingWeapon'
      }]
    }, client)
  }

  async run ({ t, channel, language, author }, query) {
    const char = await this.client.apis.genshinimpact.getCharacter(query)

    // TODO: Skill talents, paginated embed, passive talents and constellations
    // const paginatedEmbed = new PaginatedEmbed(t, author)

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.MIHOYO_COLOR)
      .setTitle(`${char.name}`)
      .setDescription(`${char.description}\n\n**${t('commands:genshinimpact.subcommands.character.rarity')}:** ${this.getEmoji('ratingstar', '⭐').repeat(Math.floor(char.rarity))}\n**${t('commands:genshinimpact.subcommands.character.vision')}:** ${char.vision}\n**${t('commands:genshinimpact.subcommands.character.weapon')}:** ${char.weapon}\n**${t('commands:genshinimpact.subcommands.character.nation')}:** ${char.nation}\n**${t('commands:genshinimpact.subcommands.character.affiliation')}:** ${char.affiliation}\n**${t('commands:genshinimpact.subcommands.character.constellation')}:** ${char.constellation}`)
      .setThumbnail(`https://api.genshin.dev/characters/${query}/portrait`)
    channel.send(embed)
  }
}
