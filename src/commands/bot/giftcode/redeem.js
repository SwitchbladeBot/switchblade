const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../../')
const { Command, CommandParameters, StringParameter, CommandRequirements } = CommandStructures

module.exports = class GiftCodeRedeem extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'giftcode')
    this.name = 'redeem'
    this.aliases = ['rdm']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: false, required: true, missingError: 'commands:giftcode.subcommands.redeem.noCode' })
    )

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, openDms: true, onlyOldAccounts: true })
  }

  async run ({ t, author, channel, language }, giftcode) {
    const embed = new SwitchbladeEmbed(author)
    try {
      giftcode = giftcode.toUpperCase()
      const { gCode } = await this.client.modules.economy.redeemGiftCode(author.id, giftcode)
      embed
        .setTitle(t('commands:giftcode.subcommands.redeem.redeemSuccessfulTitle'))
        .setDescription(t('commands:giftcode.subcommands.redeem.redeemSuccessfulDescription', { value: gCode.value }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'ALREADY_CLAIMED':
          embed.setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:giftcode.subcommands.redeem.alreadyRedeemed'))
          break
        case 'INVALID_CODE':
          embed.setColor(Constants.ERROR_COLOR)
            .setTitle(t('commands:giftcode.subcommands.redeem.invalidGiftcode'))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }
    channel.send(embed)
  }
}
