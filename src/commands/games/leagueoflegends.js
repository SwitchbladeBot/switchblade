const { Command, SwitchbladeEmbed } = require('../../')

const buttons = ['Q', 'W', 'E', 'R']
const types = ['champion', 'champ', 'c', 'status', 's', 'rotation', 'r']

module.exports = class LeagueOfLegends extends Command {
  constructor (client) {
    super(client, {
      name: 'leagueoflegends',
      aliases: ['lol'],
      requirements: { apis: ['lol'] },
      parameters: [{
        type: 'string',
        full: false,
        whitelist: types,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['champion', 'status', 'rotation'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })

    this.LOL_LOGO = 'https://i.imgur.com/4dKfQZn.jpg'
    this.LOL_COLOR = '#002366'
  }

  async generateEmbed (champion, locale, author, t) {
    const embed = new SwitchbladeEmbed(author)
    return embed.setColor(this.LOL_COLOR)
      .setAuthor('League of Legends', this.LOL_LOGO, 'https://leagueoflegends.com')
      .setTitle(`**${champion.name}**, ${champion.title}`)
      .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${this.client.apis.lol.version}/img/champion/${champion.image.full}`)
      .setDescription([
        champion.blurb,
        '',
        `**${locale.Health}:** ${champion.stats.hp} - ${champion.stats.hpperlevel}/${locale.Level}`,
        `**${locale.HealthRegen}:** ${champion.stats.hpregen} - ${champion.stats.hpregenperlevel}/${locale.Level}`,
        `**${locale.Mana}:** ${champion.stats.mp} - ${champion.stats.mpperlevel}/${locale.Level}`,
        `**${locale.ManaRegen}:** ${champion.stats.mpregen} - ${champion.stats.mpregenperlevel}/${locale.Level}`,
        `**${locale.Armor}:** ${champion.stats.armor} - ${champion.stats.armorperlevel}/${locale.Level}`,
        `**${locale.Attack}:** ${champion.stats.attackdamage} - ${champion.stats.attackdamageperlevel}/${locale.Level}`,
        `**${locale.CriticalStrike}:** ${champion.stats.crit} - ${champion.stats.critperlevel}/${locale.Level}`
      ].join('\n'))
      .addField(t('commands:leagueoflegends.subcommands.champion.spells'), champion.spells.map((spell, i) => `**${spell.name}** (${buttons[i]})`).join('\n'), true)
  }
}
