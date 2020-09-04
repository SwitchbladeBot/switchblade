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
    const { weapons, commons } = await this.client.apis.freefire.getWeaponData(language)
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
      .addField('**Attachments:**', this.getInfo(weapon, 'attachments', commons.attachment_names), true)
      .addField('**Attributes:**', this.getInfo(weapon, 'attributes', commons.attribute_names), true)
      .setImage(weapon.skins[0].image_url)

    await channel.send(embed)
  }

  getInfo (weapon, data, names) {
    return Object.entries(weapon[data])
      .map(([key, value]) => ` - **${names[key]}:** ${data === 'attachments' ? value.avaliable ? 'yes' : 'no' : value}`)
      .join('\n')
  }
}
