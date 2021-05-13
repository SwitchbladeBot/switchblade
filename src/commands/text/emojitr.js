const { Command } = require('../../')

const phrases = {
  'i':':eye:',
  'be':':bee:',
  'bee':':bee:',
  'beer':':beer:',
  'believe':':bee: :leaves:',
  'cloud':':cloud:',
  'dont':':x:',
  'eye':':eye:',
  'love':':heart:',
  'well':':whale2:'
}

module.exports = class EmojiTr extends Command {
  constructor (client) {
    super({
      name: 'emojitr',
      aliases: ['translate2emoji', 'obfuscate-emoji', 'emoji-tr'],
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
      } else if (phrases[letter]) {
        return `${phrases[letter]} `
      }
      return letter
    }).join('')
    channel.send(emojified)
  }
}
