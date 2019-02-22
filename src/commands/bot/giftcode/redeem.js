const { Command, SwitchbladeEmbed, Constants } = require('../../../')

module.exports = class GiftCodeRedeem extends Command {
  constructor (client, parentCommand) {
    super(client, {
      name: 'redeem',
      aliases: ['rdm'],
      parentCommand: 'giftcode',
      parameters: [{
        type: 'string',
        missingError: 'commands:giftcode.subcommands.redeem.noCode'
      }]
    })
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
