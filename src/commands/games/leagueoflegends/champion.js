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
      const { fetchChampion, getLocale, version } = this.client.apis.lol
      const champFetch = await fetchChampion(champion, language)
      const { name, title, blurb, image, spells, skins } = champFetch
      const { hp, hpregen, mp, mpregen, armor, attackdamage, crit, hpperlevel, hpregenperlevel, mpperlevel, mpregenperlevel, attackdamageperlevel, critperlevel } = champFetch.stats
      const locale = await getLocale(language)
      const locLevel = locale.Level
      const parentCommand = this.parentCommand
      embed.setColor(parentCommand.embedColor)
        .setAuthor(t(parentCommand.authorString), parentCommand.authorImage, parentCommand.authorURL)
        .setTitle(`**${name}**, ${title}`)
        .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${image.full}`)
        .setDescription([
          blurb,
          '',
          `**${locale.Health}:** ${hp} - ${hpperlevel}/${locLevel}`,
          `**${locale.HealthRegen}:** ${hpregen} - ${hpregenperlevel}/${locLevel}`,
          `**${locale.Mana}:** ${mp} - ${mpperlevel}/${locLevel}`,
          `**${locale.ManaRegen}:** ${mpregen} - ${mpregenperlevel}/${locLevel}`,
          `**${locale.Armor}:** ${armor} - ${armorperlevel}/${locLevel}`,
          `**${locale.Attack}:** ${attackdamage} - ${attackdamageperlevel}/${locLevel}`,
          `**${locale.CriticalStrike}:** ${crit} - ${critperlevel}/${locLevel}`
        ].join('\n'))
        .addField(t('commands:leagueoflegends.subcommands.champion.spells'), spells.map((spell, i) => `**${spell.name}** (${buttons[i]})`).join(', '), true)
        .addField(t('commands:leagueoflegends.subcommands.champion.skins'), `${skins.filter(s => s.name !== 'default').map(skin => `**${skin.name}**`).join(', ')}\n\n*${t('commands:leagueoflegends.subcommands.champion.skinText', { skinCommandUsage: `${prefix}leagueoflegends skin ${t('commands:leagueoflegends.subcommands.skin.commandUsage')}` })}*`)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.champion.invalidChamp'))
    }
  }
}