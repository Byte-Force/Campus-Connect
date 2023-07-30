// spam_classifier.js

const { InferenceSession, Tensor } = require('onnxruntime-node');
const pickle = require('node-pickle');
const { PythonShell } = require('python-shell');
const fs = require('fs');

const Classifier = require('./classifier');

const TOKENIZER_BATCH_SIZE = 1;

// Function to tokenize text using en_core_web_sm
function tokenizeText(inputText) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'text',
      pythonPath: 'python3', // Replace with the correct path to your Python 3 executable
      pythonOptions: ['-u'], // To make Python print unbuffered stdout
      scriptPath: __dirname,
      args: [inputText],
    };

    PythonShell.run('tokenize_text.py', options, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const tokens = JSON.parse(results[0]);
        resolve(tokens);
      }
    });
  });
}


class SpamClassifier extends Classifier {
  /**
   *  Initialize the SpamClassifier
   * @param {String} modelPath  path to the ONNX model
   * @param {String} tokenizerConfigPath  path to the tokenizer config file
   * @param {String} textVocabPath  Path to the text vocabulary file
   * @param {String} labelVocabPath  Path to the label vocabulary file
   */
  constructor(modelPath, tokenizerConfigPath, textVocabPath, labelVocabPath) {
    super();
    this.modelPath = modelPath;
    this.tokenizerConfigPath = tokenizerConfigPath;
    this.textVocab = pickle.loads(textVocabPath);
    this.tokenizer = tokenizeText;
  }
  /**
   * preprocess the text by tokenizing it and converting it to a Tensor
   * @param {String} text input text for classification
   * @returns {Tensor} Tensor of the preprocessed text
   */
  async preprocess(text) {

    if (!this.textVocab) {
      throw new Error('Text vocabulary not initialized. Make sure the vocabulary file is available.');
    }

    if (!this.labelVocab) {
      throw new Error('Label vocabulary not initialized. Make sure the vocabulary file is available.');
    }

    // Tokenize the text
    const token = this.tokenizer(text);

    // Convert tokens to corresponding vocabulary indices using the textVocab
    const inputIndices = tokens.map(token => this.textVocab.stoi[token]);

    // Create a Tensor from the input indices
    return new Tensor('int32', inputIndices, [TOKENIZER_BATCH_SIZE, inputIndices.length]);
  }

  /**
   * Classify the text as spam or not spam
   * @param {*} text input text for classification
   * @returns {boolean} true if spam, false if not spam
   */
  async classify(text) {
    this.model = await InferenceSession.create(this.modelPath);
    try {
      // Preprocess the text
      const inputTensor = await this.preprocess(text);

      // Run inference with the model
      const outputTensor = await this.model.run([inputTensor]);

      const prob = outputTensor.data; // Probability of spam

      // if prob > 0.7, classify as spam
      return prob > 0.7;
    } catch (error) {
      console.error('Error during classification:', error);
      throw error;
    }
  }
}


module.exports = SpamClassifier;
