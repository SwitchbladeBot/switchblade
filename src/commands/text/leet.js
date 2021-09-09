const { Command } = require('../../')
const { cleanContent } = require('discord.js').Util

const leetMap = {
  a: { soft: '4', hard: '4' },
  b: { soft: 'B', hard: 'I3' },
  c: { soft: 'C', hard: '[' },
  d: { soft: 'D', hard: '|)' },
  e: { soft: '3', hard: '3' },
  f: { soft: 'F', hard: '|=' },
  g: { soft: 'G', hard: '6' },
  h: { soft: 'H', hard: '#' },
  i: { soft: '1', hard: '1' },
  j: { soft: 'J', hard: ']' },
  k: { soft: 'K', hard: '|<' },
  l: { soft: 'L', hard: '1' },
  m: { soft: 'M', hard: '/\\/\\' },
  n: { soft: 'N', hard: '|\\|' },
  o: { soft: '0', hard: '0' },
  p: { soft: 'P', hard: '|>' },
  q: { soft: 'Q', hard: '0_' },
  r: { soft: 'R', hard: 'I2' },
  s: { soft: 'S', hard: '5' },
  t: { soft: 'T', hard: '7' },
  u: { soft: 'U', hard: '(_)' },
  v: { soft: 'V', hard: '\\/' },
  w: { soft: 'W', hard: '\\/\\/' },
  x: { soft: 'X', hard: '><' },
  y: { soft: 'Y', hard: '`/' },
  z: { soft: 'Z', hard: '2' }
}

module.exports = class Leet extends Command {
  constructor (client) {
    super({
      name: 'leet',
      category: 'memes',
      parameters: [
        {
          type: 'string',
          full: true,
          clean: true,
          missingError: 'commands:leet.missingSentence'
        },
        [{
          type: 'booleanFlag',
          name: 'hard',
          aliases: ['hc', '#4I2|D', 'hardcore']
        }]
      ]
    }, client)
  }

  async run ({ channel, flags, message }, text) {
    const leetTranslation = cleanContent(
      text
        .split('')
        .map(char => {
          const normalizedChar = char.toLowerCase()
          const mappedChar = leetMap[normalizedChar]
          return mappedChar // if char has leet translation
            ? mappedChar[flags.hard ? 'hard' : 'soft']
            : char
        })
        .join(''),
      message
    )
    channel.send(leetTranslation)
  }
}
