// Word structure (only for learned words so far):
// {
//   nextReview: Unix timestamp
//   level: integer
// }

const baseDelayMin = 90;
const baseDelayMs = baseDelayMin * 60 * 1000;

exports.buildNewlyLearned = () => {
  return {
    nextReview: Date.now() + baseDelayMs,
    level: 1
  };
};

exports.review = (word, success) => {
  if (success) {
    word.level += 1;
  } else {
    if (word.level > 1) {
      word.level -= 1;
    }
  }

  word.nextReview = Date.now() + (baseDelayMs * word.level);

  return word;
};
