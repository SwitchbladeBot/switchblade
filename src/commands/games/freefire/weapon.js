const { Command, CommandError, SwitchbladeEmbed } = require('../../../')

const Fuse = require('fuse.js')
const fetch = require('node-fetch')

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
    const { locales } = await this.getData('metadata.json')

    const locale = locales.find(locale => locale === language.slice(0, 2))

    const { weapons } = await this.getData(`${locale}/weapons.json`)

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
      .setImage(weapon.skins[0].image_url)

    await channel.send(embed)
  }

  async getData (endpoint) {
    const request = await fetch(`https://ffstaticdata.switchblade.xyz/${endpoint}`)
      .then(res => res.json())

    return request
  }
}
