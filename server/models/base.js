exports.validate = function(attributes, attributeName) {
  if (!attributes[attributeName]) {
    throw `${attributeName} must be present`;
  }
};
