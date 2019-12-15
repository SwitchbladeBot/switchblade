const { Command } = require('../../')

module.exports = class Vaporwave extends Command {
  constructor (client) {
    super({
      name: 'vaporwave',
      category: 'memes',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:vaporwave.missingSentence'
      }]
    }, client)
  }

  async run ({ t, author, channel }, text) {
    const vaporwavefied = text.split('').map(char => {
      const code = char.charCodeAt(0)
      return code >= 33 && code <= 126 ? String.fromCharCode((code - 33) + 65281) : char
    }).join('')
    channel.send(vaporwavefied)
  }
}
