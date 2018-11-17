const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter } = CommandStructures

const ladders = ['xp', 'games', 'badges', 'playtime', 'age']

// TODO: Finish the ladder command
// TODO: Add profile subcommand

module.exports = class SteamLadder extends Command {
  constructor (client) {
    super(client)
    this.name = 'steamladder'
    this.aliases = ['sl']
    this.category = 'games'
    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: false,
        whitelist: ladders,
        missingError: ({ t, prefix }) => {
          return {
            title: t('commands:steamladder.noLadder'),
            description: [
              `**${t('commons:usage')}:** \`${prefix}${this.name} ${t('commands:steamladder.commandUsage')}\``,
              '',
              `__**${t('commands:steamladder.availableLadders')}:**__`,
              `**${ladders.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n')
          }
        } })
    )
  }

  canLoad () {
    return !!this.client.apis.steamladder
  }

  async run ({ t, author, channel }, ladderType, regionOrCountry) {
    const steamladder = this.client.apis.steamladder
    const ladder = await steamladder.getLadder(ladderType, regionOrCountry)
    // TODO: Generate and send the embed
  }
}
