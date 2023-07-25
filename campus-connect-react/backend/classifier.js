class Classifier {
  constructor(modelPath, tokenizerConfigPath, tokenizerVocabPath, labelVocabPath) {
    if (new.target === Classifier) {
      throw new TypeError("Cannot instantiate abstract class.");
    }

    // Your constructor code here, if any

    if (this.classify === Classifier.prototype.classify) {
      throw new TypeError("Please implement abstract method classify.");
    }
  }

  classify(text) {
    throw new Error("Method classify() must be implemented in the child class.");
  }
}

module.exports = Classifier;
