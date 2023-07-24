// classifier.js

class Classifier {
    constructor(modelPath, tokenizerConfigPath, tokenizerVocabPath, labelVocabPath) {
      throw new Error('Method constructor() must be implemented in the child class.');
    }
  
    classify(text) {
      throw new Error('Method classify() must be implemented in the child class.');
    }
  }
  
  module.exports = Classifier;