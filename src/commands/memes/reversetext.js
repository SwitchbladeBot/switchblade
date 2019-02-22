const { Command, SwitchbladeEmbed } = require('../../index')

module.exports = class ReverseText extends Command {
  constructor (client) {
    super(client, {
      name: 'reversetext',
      category: 'memes',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:reversetext.missingSentence'
      }]
    })
  }

  async run ({ t, author, channel }, text) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(text.split('').reverse().join(''))
    )
  }
}
