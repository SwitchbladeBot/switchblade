const { Command, SwitchbladeEmbed, Constants } = require('../../../')

module.exports = class GiftCodeGenerate extends Command {
  constructor (client, parentCommand) {
    super(client, {
      name: 'generate',
      aliases: ['gnr'],
      parentCommand: 'giftcode',
      requirements: { openDms: true, onlyOldAccounts: true },
      parameters: [{
        type: 'number',
        min: 25000,
        max: 50000,
        missingError: 'commands:giftcode.subcommands.generate.noValue'
      }]
    })
  }

  async run ({ t, author, channel }, value) {
    const embed = new SwitchbladeEmbed(author)
    const Uembed = new SwitchbladeEmbed(author)
    try {
      const { identifier, giftcodeDoc } = await this.client.modules.economy.createGiftCode(author.id, value)
      embed.setDescription(t('commands:giftcode.subcommands.generate.generationSuccessful', { value }))
      Uembed.setDescription(t('commands:giftcode.subcommands.generate.hereIsYourGiftcode', { giftcode: identifier, value, command: `test` }))
      author.send(Uembed)
      console.log(identifier, giftcodeDoc.generatedBy)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      console.log(e)
      switch (e.message) {
        case 'NOT_ENOUGH_MONEY':
          embed.setTitle(t('commands:giftcode.subcommands.generate.notEnoughMoney'))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }
    channel.send(embed)
  }
}
