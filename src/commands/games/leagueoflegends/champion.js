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
      const lolApi = this.client.apis.lol
      const champ = await lolApi.fetchChampion(champion, language)
      const champStats = champ.stats
      const locale = await lolApi.getLocale(language)
      const locLevel = locale.Level
      const parentCommand = this.parentCommand
      embed.setColor(parentCommand.embedColor)
        .setAuthor(t(parentCommand.authorString), parentCommand.authorImage, parentCommand.authorURL)
        .setTitle(`**${champ.name}**, ${champ.title}`)
        .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${lolApi.version}/img/champion/${champ.image.full}`)
        .setDescription([
          champ.blurb,
          '',
          `**${locale.Health}:** ${champStats.hp} - ${champStats.hpperlevel}/${locLevel}`,
          `**${locale.HealthRegen}:** ${champStats.hpregen} - ${champStats.hpregenperlevel}/${locLevel}`,
          `**${locale.Mana}:** ${champStats.mp} - ${champStats.mpperlevel}/${locLevel}`,
          `**${locale.ManaRegen}:** ${champStats.mpregen} - ${champStats.mpregenperlevel}/${locLevel}`,
          `**${locale.Armor}:** ${champStats.armor} - ${champStats.armorperlevel}/${locLevel}`,
          `**${locale.Attack}:** ${champStats.attackdamage} - ${champStats.attackdamageperlevel}/${locLevel}`,
          `**${locale.CriticalStrike}:** ${champStats.crit} - ${champStats.critperlevel}/${locLevel}`
        ].join('\n'))
        .addField(t('commands:leagueoflegends.subcommands.champion.spells'), champ.spells.map((spell, i) => `**${spell.name}** (${buttons[i]})`).join(', '), true)
        .addField(t('commands:leagueoflegends.subcommands.champion.skins'), `${champ.skins.filter(s => s.name !== 'default').map(skin => `**${skin.name}**`).join(', ')}\n\n*${t('commands:leagueoflegends.subcommands.champion.skinText', { skinCommandUsage: `${prefix}leagueoflegends skin ${t('commands:leagueoflegends.subcommands.skin.commandUsage')}` })}*`)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.champion.invalidChamp'))
    }
  }
}