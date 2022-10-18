const {
  Command,
  SwitchbladeEmbed,
  PaginatedEmbed,
  CommandError,
  Constants
} = require('../../../')

const moment = require('moment')

module.exports = class GenshinImpactCharacter extends Command {
  constructor (client) {
    super(
      {
        name: 'character',
        aliases: ['char', 'c'],
        parent: 'genshinimpact',
        botPermissions: ['MANAGE_MESSAGES'],
        parameters: [
          {
            type: 'string',
            full: true,
            missingError:
              'commands:genshinimpact.subcommands.character.noCharacter'
          }
        ]
      },
      client
    )
  }

  async run ({ t, author, channel, language }, character) {
    channel.startTyping()
    moment.locale(language)

    const {
      embedColor,
      authorString,
      authorImage,
      authorURL
    } = this.parentCommand
    try {
      const {
        name,
        vision,
        weapon,
        birthday,
        nation,
        affiliation,
        rarity,
        constellation,
        description,
        skillTalents,
        passiveTalents,
        constellations
      } = await this.client.apis.genshinimpact.getCharacter(character)
      const characterId = await this.client.apis.genshinimpact.getCharacterId(
        name
      )

      const paginatedEmbed = new PaginatedEmbed(t, author)

      paginatedEmbed.addPage(
        new SwitchbladeEmbed(author)
          .setColor(embedColor)
          .setAuthor(t(authorString), authorImage, authorURL)
          .setTitle(`${name} ${'✦'.repeat(rarity)} | ${vision} • ${weapon}`)
          .setDescriptionFromBlockArray([
            [description || ''],
            [
              nation ? `**Nation**: ${nation}` : '',
              affiliation ? `**Affiliation**: ${affiliation}` : '',
              constellation ? `**Constellation**: ${constellation}` : '',
              birthday
                ? `**Birthday**: ${moment(birthday).format('MMMM Do')}`
                : ''
            ]
          ])
          .setThumbnail(
            `https://api.genshin.dev/characters/${characterId}/gacha-splash.png`
          )
      )

      paginatedEmbed.addPage(
        new SwitchbladeEmbed(author)
          .setColor(embedColor)
          .setAuthor(t(authorString), authorImage, authorURL)
          .setTitle(`${name} - Skill Talents`)
          .setDescriptionFromBlockArray([
            skillTalents.map(s => {
              return `**${s.name}** (${s.unlock})\n${s.description}\n`
            })
          ])
      )

      if (passiveTalents) {
        paginatedEmbed.addPage(
          new SwitchbladeEmbed(author)
            .setColor(embedColor)
            .setAuthor(t(authorString), authorImage, authorURL)
            .setTitle(`${name} - Passive Talents`)
            .setDescriptionFromBlockArray([
              passiveTalents.map(s => {
                return `**${s.name}** (${s.unlock})\n${s.description}\n`
              })
            ])
        )
      }

      if (constellations) {
        paginatedEmbed.addPage(
          new SwitchbladeEmbed(author)
            .setColor(embedColor)
            .setAuthor(t(authorString), authorImage, authorURL)
            .setTitle(`${name} - Constellations`)
            .setDescriptionFromBlockArray([
              constellations.map(s => {
                return `**${s.name}** (${s.unlock})\n${s.description}\n`
              })
            ])
        )
      }

      paginatedEmbed.run(await channel.send(Constants.EMPTY_SPACE))
      channel.stopTyping()
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
