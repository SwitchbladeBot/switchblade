const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class FlipText extends Command {
  constructor (client) {
    super(client, {
      name: 'fliptext',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:fliptext.noSentence'
      }]
    })
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
