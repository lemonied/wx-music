export function parseCharacter(str) {
  let entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    ':': '&#58;',
    '\n': '&#10;',
    '.': '&#46;',
    '-': '&#45;',
    ' ': '&#32;',
    '(': '&#40;',
    ')': '&#41;'
  }
  for (let i in entities) {
    if (entities.hasOwnProperty(i)) {
      const reg = new RegExp(entities[i], 'g')
      str = str.replace(reg, i)
    }
  }
  return str
}
