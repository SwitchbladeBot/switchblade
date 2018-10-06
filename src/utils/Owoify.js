const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^']

function Owoify (str) {
  str = str.replace(/(?:r|l)/g, 'w')
  str = str.replace(/(?:R|L)/g, 'W')
  str = str.replace(/n([aeiou])/g, 'ny$1')
  str = str.replace(/N([aeiou])/g, 'Ny$1')
  str = str.replace(/N([AEIOU])/g, 'Ny$1')
  str = str.replace(/ove/g, 'uv')
  str = str.replace(/!+/g, ' ' + faces[Math.floor(Math.random() * faces.length)] + ' ')

  return str
};

module.exports = Owoify
