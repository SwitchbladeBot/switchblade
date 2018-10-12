const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class FlipText extends Command {
  constructor (client) {
    super(client)
    this.name = 'fliptext'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:fliptext.noSentence' })
    )
  }

  run ({ author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~'
    const offset = '!'.charCodeAt(0)
    embed.setTitle(
      text.split('')
        .map(c => c.charCodeAt(0) - offset)
        .map(c => mapping[c] || ' ')
        .reverse().join('')
    )
    channel.send(embed)
  }
}
