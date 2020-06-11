// Word structure (only for learned words so far):
// {
//   nextReview: Unix timestamp
//   level: integer
// }

// one hour in milliseconds
const oneHour = 60 * 60 * 1000;
const baseDelay = 12 * oneHour;

exports.buildNewlyLearned = () => {
  return {
    nextReview: Date.now() + baseDelay,
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

  // introduce plus or minus one hour of jitter
  let jitter = (2 * oneHour * Math.random()) - oneHour;
  let newDelay = baseDelay * (Math.pow(2, (word.level - 1))) + jitter;
  word.nextReview = Date.now() + newDelay;

  return word;
};
