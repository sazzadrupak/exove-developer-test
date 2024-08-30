const customQuickSort = (words) => {
  const compare = (a, b, letterPosition) => {
    const charCodeA = a.charCodeAt(letterPosition);
    const charCodeB = b.charCodeAt(letterPosition);
    const diff = charCodeA - charCodeB;
    if (diff === 0) {
      return letterPosition > 0 ? compare(a, b, letterPosition - 1) : 0;
    }
    return diff;
  };

  const partition = (words, start, end) => {
    // To solve worst case time complexity of O(n^2), random pivot index needs to be selected
    const randomPivotIndex =
      Math.floor(Math.random() * (end - start + 1)) + start;

    let pivotValue = words[randomPivotIndex];

    [words[start], words[randomPivotIndex]] = [
      words[randomPivotIndex],
      words[start],
    ];

    let swapIndex = start;
    const letterPosition = 2;
    for (let i = start + 1; i <= end; i++) {
      if (compare(words[i], pivotValue, letterPosition) <= 0) {
        swapIndex++;
        [words[i], words[swapIndex]] = [words[swapIndex], words[i]];
      }
    }
    [words[swapIndex], words[start]] = [words[start], words[swapIndex]];
    return swapIndex;
  };

  const quickSort = (words, start = 0, end = words.length - 1) => {
    if (start >= end) return;
    let pivot = partition(words, start, end);
    quickSort(words, start, pivot - 1);
    quickSort(words, pivot + 1, end);
    return words;
  };

  return quickSort(words);
};

const wordsList = [
  'AACAA',
  'BOAT',
  'Locomotive',
  'Poet',
  'Accelerate',
  'GOLF',
  'ACCIDENTAL',
  'Submarine',
];

console.log(customQuickSort(wordsList));
