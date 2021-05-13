const { Command } = require('../../')

const specialCodes = {
  0: ':zero:',
  1: ':one:',
  2: ':two:',
  3: ':three:',
  4: ':four:',
  5: ':five:',
  6: ':six:',
  7: ':seven:',
  8: ':eight:',
  9: ':nine:',
  '#': ':hash:',
  '*': ':asterisk:',
  '?': ':grey_question:',
  '!': ':grey_exclamation:',
  ' ': '   '
}

module.exports = class Emojify extends Command {
  constructor (client) {
    super({
      name: 'emojify',
      category: 'memes',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:emojify.missingSentence'
      }]
    }, client)
  }

  async run ({ t, author, channel }, text) {
    const emojified = text.toLowerCase().split('').map(letter => {
      if (/[a-z]/g.test(letter)) {
        return `:regional_indicator_${letter}: `
      } else if (specialCodes[letter]) {
        return `${specialCodes[letter]} `
      }
      return letter
    }).join('')
    channel.send(emojified)
  }
}
