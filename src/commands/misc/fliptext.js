const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class FlipText extends Command {
  constructor (client) {
    super(client)
    this.name = 'fliptext'
  }

  run (message, args) {
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('You need to give me a sentence to flip')
        .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <sentence>`)
    } else {
      const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~'
      const offset = '!'.charCodeAt(0)
      embed.setTitle(
        args.join(' ').split('')
          .map(c => c.charCodeAt(0) - offset)
          .map(c => mapping[c] || ' ')
          .reverse().join('')
      )
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
