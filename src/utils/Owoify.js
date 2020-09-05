const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^']

function Owoify (str) {
  return str
    .replace(/(?:r|l)/g, 'w')
    .replace(/(?:R|L)/g, 'W')
    .replace(/n([aeiou])/g, 'ny$1')
    .replace(/N([aeiou])/g, 'Ny$1')
    .replace(/N([AEIOU])/g, 'Ny$1')
    .replace(/ove/g, 'uv')
    .replace(/!+/g, ' ' + faces[Math.floor(Math.random() * faces.length)] + ' ')
}

module.exports = Owoify
