const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

const buttons = ['Q', 'W', 'E', 'R']

module.exports = class LeagueOfLegendsChampion extends Command {
  constructor (client) {
    super({
      name: 'champion',
      aliases: ['champ', 'c'],
      parent: 'leagueoflegends',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:leagueoflegends.subcommands.champion.noChampion'
      }]
    }, client)
  }

  async run ({ t, author, channel, prefix, language }, champion) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const champ = await this.client.apis.lol.fetchChampion(champion, language)
      const locale = await this.client.apis.lol.getLocale(language)
      embed.setColor(this.parentCommand.embedColor)
        .setAuthor(t(this.parentCommand.authorString), this.parentCommand.authorImage, this.parentCommand.authorURL)
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
        .addField(t('commands:leagueoflegends.subcommands.champion.skins'), `${champ.skins.filter(s => s.name !== "default").map(skin => `**${skin.name}**`).join(', ')}\n\n*Want to see any of these skins? Use \`${prefix}leagueoflegends skin ${t('commands:leagueoflegends.subcommands.skin.commandUsage')}\`!*`)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.champion.invalidChamp'))
    }
  }
}
