const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements, CommandParameters, NumberParameter, StringParameter } = CommandStructures

module.exports = class Giftcode extends Command {
  constructor (client) {
    super(client)
    this.name = 'giftcode'
    this.category = 'bot'
    this.subcommands = [new GiftcodeGenerate(client, this), new GiftcodeRedeem(client, this)]

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, openDms: true })
  }

  run ({ t, author, prefix, alias, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription([
      t('commands:giftcode.generate', { command: `${prefix}${alias || this.name}` }),
      t('commands:giftcode.redeem', { command: `${prefix}${alias || this.name}` })
    ].join('\n'))
    channel.send(embed)
  }
}

class GiftcodeGenerate extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'generate'

    this.parameters = new CommandParameters(this,
      new NumberParameter({ min: 1, max: 50000, missingError: 'commands:giftcode.subcommands.generate.noValue' })
    )
  }

  async run({ t, author, channel, userDocument, prefix, alias }, value) {
    const embed = new SwitchbladeEmbed(author)
    const userEmbed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (value > userDocument.money) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:giftcode.subcommands.generate.notEnoughMoney'))
    } else {
      const identifier = await this.generateRandomString(10)
      const giftcodeDocument = await this.client.database.giftcodes.get(identifier)
      giftcodeDocument.value = value
      giftcodeDocument.generatedBy = author.id
      userDocument.money -= value
      giftcodeDocument.save()
      userDocument.save()
      embed.setDescription(t('commands:giftcode.subcommands.generate.generationSuccessful', { value }))
      userEmbed.setDescription(t('commands:giftcode.subcommands.generate.hereIsYourGiftcode', { giftcode: identifier, value, command: `${prefix}${alias || this.parentCommand.name}` }))
      author.send(userEmbed)
    }
    channel.send(embed).then(() => channel.stopTyping())
  }

  generateRandomString (length) {
    const str = []
    for (let i = 0; i < length; i++) {
        str.push(Math.round(Math.random() * 36).toString(36))
    }
    return str.join('').toUpperCase()
  }
}

class GiftcodeRedeem extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'redeem'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: false, missingError: 'commands:giftcode.subcommands.redeem.noCode' })
    )
  }

  async run({ t, author, channel, userDocument }, giftcode) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const giftcodeDocument = await this.client.database.giftcodes.findOne(giftcode)
    if (!giftcodeDocument) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:giftcode.subcommands.redeem.invalidGiftcode'))
    } else if (giftcodeDocument.claimed) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:giftcode.subcommands.redeem.alreadyRedeemed'))
    } else {
      giftcodeDocument.claimed = true
      giftcodeDocument.claimedBy = author.id
      giftcodeDocument.save()
      embed
        .setTitle(t('commands:giftcode.subcommands.redeem.redeemSuccessfulTitle'))
        .setDescription(t('commands:giftcode.subcommands.redeem.redeemSuccessfulDescription', { value: giftcodeDocument.value }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
