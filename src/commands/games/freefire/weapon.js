const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const Fuse = require('fuse.js')

module.exports = class FreeFireWeapon extends Command {
  constructor (client) {
    super({
      name: 'weapon',
      aliases: ['w'],
      parent: 'freefire',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:freefire.subcommands.weapon.missingWeapon'
      }]
    }, client)
  }

  async run ({ t, channel, language }, query) {
    const {
      weapons,
      commons: { attribute_names: attributeNames, attachment_names: attachmentNames }
    } = await this.client.apis.freefire.getWeaponData(language)

    const fuse = new Fuse(weapons, {
      shouldSort: true,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'name'
      ]
    })

    const weapon = fuse.search(query)[0]

    if (!weapon) {
      throw new CommandError(t('commands:freefire.subcommands.weapon.unknownWeapon', {
        weapon: query
      }))
    }

    const embed = new SwitchbladeEmbed()
      .setTitle(weapon.name)
      .setDescription(`**${weapon.description}**`)
      .addFields([
        {
          name: t('commands:freefire.subcommands.weapon.attributes'),
          value: this.getInfo({ t, weapon, data: 'attributes', names: attributeNames }),
          inline: true
        },
        {
          name: t('commands:freefire.subcommands.weapon.attachments'),
          value: this.getInfo({ t, weapon, data: 'attachments', names: attachmentNames }),
          inline: true
        }
      ])
      .setImage(weapon.skins[0].image_url)

    await channel.send(embed)
  }

  getInfo ({ t, weapon, data, names }) {
    return Object.entries(weapon[data])
      .filter(([key, value]) => value.avaliable || value >= 1)
      .map(([key, value]) => ` - **${names[key]}**: ${data !== 'attachments' ? value : ''}`)
      .join('\n')
  }
}
