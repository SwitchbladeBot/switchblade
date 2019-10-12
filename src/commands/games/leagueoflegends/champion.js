const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

const buttons = ['Q', 'W', 'E', 'R']

module.exports = class LeagueOfLegendsChampion extends Command {
  constructor (client) {
    super(client, {
      name: 'champion',
      aliases: ['champ', 'c'],
      parentCommand: 'leagueoflegends',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:leagueoflegends.subcommands.champion.noChampion'
      }]
    })
  }

  async run ({ t, author, channel, language }, champion) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const champ = await this.client.apis.lol.fetchChampion(champion, language)
      const locale = await this.client.apis.lol.getLocale(language)
      embed.setColor(this.parentCommand.LOL_COLOR)
        .setAuthor('League of Legends', this.parentCommand.LOL_LOGO, 'https://leagueoflegends.com')
        .setTitle(`**${champ.name}**, ${champ.title}`)
        .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${this.client.apis.lol.version}/img/champion/${champ.image.full}`)
        .setDescription([
          champ.blurb,
          '',
          `**${locale.Health}:** ${champ.stats.hp} - ${champ.stats.hpperlevel}/${locale.Level}`,
          `**${locale.HealthRegen}:** ${champ.stats.hpregen} - ${champ.stats.hpregenperlevel}/${locale.Level}`,
          `**${locale.Mana}:** ${champ.stats.mp} - ${champ.stats.mpperlevel}/${locale.Level}`,
          `**${locale.ManaRegen}:** ${champ.stats.mpregen} - ${champ.stats.mpregenperlevel}/${locale.Level}`,
          `**${locale.Armor}:** ${champ.stats.armor} - ${champ.stats.armorperlevel}/${locale.Level}`,
          `**${locale.Attack}:** ${champ.stats.attackdamage} - ${champ.stats.attackdamageperlevel}/${locale.Level}`,
          `**${locale.CriticalStrike}:** ${champ.stats.crit} - ${champ.stats.critperlevel}/${locale.Level}`
        ].join('\n'))
        .addField(t('commands:leagueoflegends.subcommands.champion.spells'), champ.spells.map((spell, i) => `**${spell.name}** (${buttons[i]})`).join(', '), true)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.champion.invalidChamp'))
    }
  }
}
