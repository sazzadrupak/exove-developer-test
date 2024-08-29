const words = [
  'AACAA',
  'BOAT',
  'Locomotive',
  'Poet',
  'Accelerate',
  'GOLF',
  'ACCIDENTAL',
  'Submarine',
];

function sortBy(a, b, pos) {
  if (a.charCodeAt(pos) - b.charCodeAt(pos) === 0) {
    return pos > 0 ? sortBy(a, b, pos - 1) : 0;
  }
  return a.charCodeAt(pos) - b.charCodeAt(pos);
}
console.log(words.sort((a, b) => sortBy(a, b, 2)));
