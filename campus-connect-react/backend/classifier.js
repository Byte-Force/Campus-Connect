// classifier.js

class Classifier {
    constructor(modelPath, tokenizerConfigPath, tokenizerVocabPath, labelVocabPath) {
      this.modelPath = modelPath;
      this.tokenizerConfigPath = tokenizerConfigPath;
      this.tokenizerVocabPath = tokenizerVocabPath;
      this.labelVocabPath = labelVocabPath;
    }
  
    classify(text) {
      throw new Error('Method classify() must be implemented in the child class.');
    }
  }
  
  module.exports = Classifier;