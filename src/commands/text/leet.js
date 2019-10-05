const { Command } = require('../../')

const leetMap = {
  a: { soft: '4', hard: '4' },
  b: { soft: 'b', hard: 'I3' },
  c: { soft: 'c', hard: '[' },
  d: { soft: 'd', hard: '|)' },
  e: { soft: '3', hard: '3' },
  f: { soft: 'f', hard: '|=' },
  g: { soft: 'g', hard: '6' },
  h: { soft: 'h', hard: '#' },
  i: { soft: '1', hard: '1' },
  j: { soft: 'j', hard: ']' },
  k: { soft: 'k', hard: '|<' },
  l: { soft: 'l', hard: '1' },
  m: { soft: 'm', hard: '/\\/\\' },
  n: { soft: 'n', hard: '|\\|' },
  o: { soft: '0', hard: '0' },
  p: { soft: 'p', hard: '|>' },
  q: { soft: 'q', hard: '0_' },
  r: { soft: 'r', hard: 'I2' },
  s: { soft: 's', hard: '5' },
  t: { soft: 't', hard: '7' },
  u: { soft: 'u', hard: '(_)' },
  v: { soft: 'v', hard: '\\/' },
  w: { soft: 'w', hard: '\\/\\/' },
  x: { soft: 'x', hard: '><' },
  y: { soft: 'y', hard: 'j' },
  z: { soft: 'z', hard: '2' }
}

module.exports = class Leet extends Command {
  constructor (client) {
    super(client, {
      name: 'leet',
      category: 'memes',
      parameters: [{
        type: 'booleanFlag',
        name: 'hard',
        aliases: [ 'hc', '#4I2|D', 'hardcore' ]
      },
      {
        type: 'string',
        full: true,
        missingError: 'commands:leet.missingSentence'
      }
      ]
    })
  }

  async run ({ channel, flags }, text) {
    const leetTranslation = text
      .split('')
      .map(char => {
        const normalizedChar = char.toLower()
        const mappedChar = leetMap[normalizedChar]
        return mappedChar // if char has leet translation
          ? mappedChar[flags.hard ? 'hard' : 'soft']
          : char
      })
      .join('')
    channel.send(leetTranslation)
  }
}
