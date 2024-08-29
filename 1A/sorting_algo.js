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
  const diff = a.charCodeAt(pos) - b.charCodeAt(pos);
  if (diff === 0) {
    return pos > 0 ? sortBy(a, b, pos - 1) : 0;
  }
  return diff;
}
console.log(words.sort((a, b) => sortBy(a, b, 2)));
